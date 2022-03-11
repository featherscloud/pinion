import { join } from 'path'
import { stat } from 'fs/promises'
import { PinionContext, Callable, mapCallables, runModule } from '../core'
import { listFiles, merge } from '../utils'

/**
* Run all Pinion generators within a folder in sequence, ordered by name
*
* @param pathParts The parts of the folder to run. Can be assembled dynamically based on context.
* @returns The context returned by all generators merged together
*/
export const runGenerators = <C extends PinionContext> (...pathParts: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const name = join(...await mapCallables(pathParts, ctx))
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
      merge(ctx, await runModule(file, ctx))
    }

    return ctx
  }

/**
 * Run a single generator file
 *
 * @param pathParts
 * @returns
 */
export const runGenerator = <C extends PinionContext> (...pathParts: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const name = join(...await mapCallables(pathParts, ctx))

    return runModule(name, ctx)
  }
