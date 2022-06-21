import { resolve, dirname, relative, join } from 'path'
import { mkdir, readFile, writeFile, copyFile } from 'fs/promises'
import { PinionContext, Callable, mapCallables, getCallable } from '../core'
import { WriteFileOptions, promptWriteFile, overwrite, addTrace } from './helpers'
import { listAllFiles, merge } from '../utils'

const fileName =
  (createFolders: boolean = false) =>
  <C extends PinionContext>(...targets: Callable<string | string[], C>[]) =>
      async <T extends C>(ctx: T) => {
        const segments = (await mapCallables(targets, ctx)).flat()
        const fullPath = resolve(ctx.cwd, ...segments)

        if (createFolders) {
          await mkdir(dirname(fullPath), {
            recursive: true
          })
        }

        return fullPath
      }

export const toFile = fileName(true)

export const fromFile = fileName()

export type JSONData = { [key: string]: any }

/**
 * Recursively copy all files from a folder to a destination.
 * Will prompt if the to file already exists.
 *
 * @param from The (local) folder to copy files from
 * @param to The destination to copy the files to
 * @param options File copy options (e.g. `{ force: true }`)
 * @returns The current context
 */
export const copyFiles =
  <C extends PinionContext>(
    from: Callable<string, C>,
    to: Callable<string, C>,
    options: Partial<WriteFileOptions> = {}
  ) =>
    async <T extends C>(ctx: T) => {
      const source = await getCallable(from, ctx)
      const target = await getCallable(to, ctx)
      const fileList = await listAllFiles(source)

      await Promise.all(
        fileList.map(async (file) => {
          const destination = join(target, relative(source, file))

          await mkdir(dirname(destination), {
            recursive: true
          })

          if (await overwrite(ctx, destination, options)) {
            await copyFile(file, destination)
          }
        })
      )

      return addTrace(ctx, 'copyFiles', { fileList, target, source })
    }

/**
 * Load a JSON file and merge the data into the context
 *
 * @param file The name of the JSON file
 * @param converter A converter that returns the data that will be merged into the context
 * @returns The current context
 */
export const loadJSON =
  <C extends PinionContext>(
    file: Callable<string, C>,
    converter: (data: JSONData, ctx: C) => JSONData = (data) => data,
    fallback?: Callable<JSONData, C>
  ) =>
    async <T extends C>(ctx: T) => {
      const fileName = await getCallable(file, ctx)
      let data

      try {
        const content = (await readFile(fileName)).toString()
        data = JSON.parse(content)
      } catch (error) {
        if (fallback) {
          data = await getCallable(fallback, ctx)
        } else {
          throw error
        }
      }

      const converted = await converter(data, ctx)
      const result = {
        ...ctx,
        ...converted
      } as T

      return addTrace(result, 'loadJSON', { fileName, data })
    }

/**
 * Write formatted JSON to a file
 *
 * @param json The JSON data to write
 * @param file The filename to write to
 * @returns The current context
 */
export const writeJSON =
  <C extends PinionContext>(
    json: Callable<JSONData, C>,
    file: Callable<string, C>,
    options: Partial<WriteFileOptions> = {}
  ) =>
    async <T extends C>(ctx: T) => {
      const fileName = await getCallable(file, ctx)
      const data = await getCallable(json, ctx)
      const content = JSON.stringify(data, null, '  ')
      const result = await promptWriteFile(fileName, content, ctx, options)

      return addTrace(result, 'writeJSON', { fileName, data })
    }

/**
 * Merge an existing JSON file with new data
 *
 * @param json The JSON data to add to the file
 * @param file The filename to write to
 * @returns The current context
 */
export const mergeJSON =
  <C extends PinionContext>(json: Callable<JSONData, C>, file: Callable<string, C>) =>
    async <T extends C>(ctx: T) => {
      const fileName = await getCallable(file, ctx)
      const payload = await getCallable(json, ctx)
      const existingContent = (await readFile(fileName)).toString()
      const data = merge(JSON.parse(existingContent), payload)
      const content = JSON.stringify(data, null, '  ')

      await writeFile(fileName, content)

      return addTrace(ctx, 'mergeJSON', { fileName, payload })
    }
