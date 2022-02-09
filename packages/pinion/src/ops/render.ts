import path from 'path'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { prompt } from 'inquirer'

import { Context, Callable, getCallable } from '../core'

/**
 * Renders a template to a file.
 *
 * @param template The template to render
 * @param target The target file handle, usually provided by `to()`
 * @returns The generator context
 */
export const render = <C extends Context> (template: Callable<string, C>, target: Callable<string, C>) =>
  async <T extends C> (ctx: T) => {
    const fileName = await getCallable(target, ctx)
    const content = await getCallable(template, ctx)

    if (existsSync(fileName)) {
      const { overwrite } = await prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `File ${path.relative(ctx.cwd, fileName)} already exists. Overwrite?`
      }])

      if (!overwrite) { // || force
        return ctx
      }
    }

    await writeFile(fileName, content)

    return ctx
  }
