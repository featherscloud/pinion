import { join } from 'path'
import { stat } from 'fs/promises'
import { PinionContext, Callable, mapCallables, runModule } from '../core'
import { listFiles, merge } from '../utils'

/**
* Run all Pinion generators within a folder in parallel.
*
* @param pathParts The parts of the folder to run. Can be assembled dynamically based on context.
* @returns The most recent context
*/
export const runGenerators = <C extends PinionContext> (...pathParts: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const name = join(...await mapCallables(pathParts, ctx))
    const handle = await stat(name)
    const runGenerator = async (fileName: string) => runModule(fileName, ctx)

    if (handle.isFile()) {
      await runGenerator(name)

      return ctx
    } else if (handle.isDirectory()) {
      const files = await listFiles(name, '.tpl.ts')
      const contexts = await Promise.all(files.map(runGenerator))

      contexts.forEach(current => merge(ctx, current))
    }

    return ctx
  }
