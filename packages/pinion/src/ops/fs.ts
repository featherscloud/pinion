import { resolve, dirname } from 'path'
import { mkdir, readFile } from 'fs/promises'
import {
  PinionContext, Callable, mapCallables, getCallable, promptWriteFile
} from '../core'

/**
 * Return an absolute filename based on the current folder
 *
 * @param target The (relative) filename
 * @returns The absolute resolved filename
 */
export const fileName = <C extends PinionContext> (...targets: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const segments = await mapCallables(targets, ctx)
    const fullPath = resolve(ctx.cwd, ...segments)

    await mkdir(dirname(fullPath), {
      recursive: true
    })

    return fullPath
  }

export const toFile = fileName

export const fromFile = fileName

export type JSONData = { [key: string]: any }

/**
 * Load a JSON file and merge the data into the context
 *
 * @param file The name of the JSON file
 * @param converter A converter that returns the data that will be merged into the context
 * @returns The current context
 */
export const loadJSON = <C extends PinionContext> (
  file: Callable<string, C>,
  converter: (data: JSONData, ctx: C) => JSONData = data => data,
  fallback?: Callable<JSONData, C>
) => async <T extends C> (ctx: T) => {
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

    return {
      ...ctx,
      ...converted
    } as T
  }

/**
 * Write formatted JSON to a file
 *
 * @param json The JSON data to write
 * @param file The filename to write to
 * @returns The current context
 */
export const writeJSON = <C extends PinionContext> (json: Callable<JSONData, C>, file: Callable<string, C>) =>
  async <T extends C> (ctx: T) => {
    const fileName = await getCallable(file, ctx)
    const data = await getCallable(json, ctx)
    const content = JSON.stringify(data, null, '  ')

    return promptWriteFile(fileName, content, ctx)
  }
