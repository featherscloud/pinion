import { join } from 'path'
import { runModule, PinionContext, Callable, mapCallables } from '../core'
import { listFiles } from '../utils'

/**
 * Run a single Pinion template file
 *
 * @param file The name of the module to run
 * @returns The most recent context
 */
export const runFile = <C extends PinionContext> (...files: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const fileParts = await mapCallables(files, ctx)
    const fileName = join(...fileParts)

    return runModule(fileName, ctx)
  }

/**
* Run all Pinion template files within a folder, sequentially in alphabetical order
*
* @param folder The folder to run
* @returns The most recent context
*/
export const runFolder = <C extends PinionContext> (...folders: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const pathParts = await mapCallables(folders, ctx)
    const folderName = join(...pathParts)
    const files = await listFiles(folderName, '.tpl.ts')
    let currentCtx = ctx

    for (const fileName of files) {
      const runner = runFile(fileName)

      currentCtx = await runner(currentCtx)
    }

    return currentCtx
  }
