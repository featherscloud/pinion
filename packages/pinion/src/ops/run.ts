import { join } from 'path'
import { stat } from 'fs/promises'
import { PinionContext, Callable, runModule, mapCallables } from '../core'
import { listFiles } from '../utils'
import { addTrace } from './helpers'

const getFileName = async <C extends PinionContext>(ctx: C, pathParts: Callable<string | string[], C>[]) => {
  const segments = (await mapCallables(pathParts, ctx)).flat()

  return join(...segments)
}

/**
 * Run all Pinion generators within a folder in sequence, ordered by name
 *
 * @param pathParts The parts of the folder to run. Can be assembled dynamically based on context.
 * @returns The context returned by all generators merged together
 */
export const runGenerators =
  <C extends PinionContext>(...pathParts: Callable<string, C>[]) =>
    async <T extends C>(ctx: T) => {
      const name = await getFileName(ctx, pathParts)
      const handle = await stat(name)

      if (!handle.isDirectory()) {
        throw new Error(`${name} must be a directory (runGenerators)`)
      }

      const [compiledFiles, tsFiles] = await Promise.all([
        listFiles(name, '.tpl.js'),
        listFiles(name, '.tpl.ts')
      ])
      const files = compiledFiles.length ? compiledFiles : tsFiles

      for (const file of files.sort()) {
        await runModule(file, ctx)
      }

      return addTrace(ctx, 'runGenerators', { files })
    }

/**
 * Run a single generator file
 *
 * @param pathParts The parts of the folder to run. Can be assembled dynamically based on context.
 * @returns The current and generator context merged together
 */
export const runGenerator =
  <C extends PinionContext>(...pathParts: Callable<string, C>[]) =>
    async <T extends C>(ctx: T) => {
      const name = await getFileName(ctx, pathParts)

      await runModule(name, ctx)

      return ctx
    }
