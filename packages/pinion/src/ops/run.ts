import { join } from 'path'
import { stat } from 'fs/promises'
import { PinionContext, Callable, mapCallables, runModule } from '../core'
import { listFiles, merge } from '../utils'

/**
* Run all Pinion generators within a folder in parallel.
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

    const files = await listFiles(name, '.tpl.ts')
    const contexts = await Promise.all(files.map(file => runModule(file, ctx)))

    contexts.forEach(current => merge(ctx, current))

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
    const handle = await stat(name)

    if (!handle.isFile()) {
      throw new Error(`${name} is not a valid file (runGenerator)`)
    }

    return runModule(name, ctx)
  }
