import { join } from 'path'
import { lstat } from 'fs/promises'
import { runModule, PinionContext, Callable, mapCallables } from '../core'
import { listFiles } from '../utils'

/**
* Run all Pinion generators within a folder sequentially in alphabetical order.
*
* @param pathParts The parts of the folder to run. Can be assembled dynamically based on context.
* @returns The most recent context
*/
export const runGenerators = <C extends PinionContext> (...pathParts: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const name = join(...await mapCallables(pathParts, ctx))
    const stat = await lstat(name)

    if (stat.isFile()) {
      return runModule(name, ctx)
    }

    if (stat.isDirectory()) {
      const files = await listFiles(name, '.tpl.ts')
      let currentCtx = ctx

      for (const fileName of files) {
        currentCtx = await runModule(fileName, currentCtx)
      }

      return currentCtx
    }
  }
