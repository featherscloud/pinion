import { relative, resolve, dirname } from 'path'
import { existsSync } from 'fs'
import { writeFile, mkdir } from 'fs/promises'
import { PinionContext, Callable, getCallable, mapCallables } from '../core'

/**
 * Return an absolute filename based on the current folder
 *
 * @param target The (relative) filename
 * @returns The absolute resolved filename
 */
export const to = <C extends PinionContext> (...targets: Callable<string, C>[]) =>
  async <T extends C> (ctx: T) => {
    const segments = await mapCallables(targets, ctx)
    const fullPath = resolve(ctx.cwd, ...segments)

    await mkdir(dirname(fullPath), {
      recursive: true
    })

    return fullPath
  }

/**
 * Renders a template to a file.
 *
 * @param template The template to render
 * @param target The target file handle, usually provided by `to()`
 * @returns The generator context
 */
export const renderTemplate = <C extends PinionContext> (template: Callable<string, C>, target: Callable<string, C>) =>
  async <T extends C> (ctx: T) => {
    const fileName = await getCallable(target, ctx)
    const content = await getCallable(template, ctx)
    const { force, logger, prompt } = ctx.pinion

    if (existsSync(fileName) && !force) {
      const { overwrite } = await prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `File ${relative(ctx.cwd, fileName)} already exists. Overwrite?`
      }])

      if (!overwrite) {
        return ctx
      }
    }

    await writeFile(fileName, content)

    logger.log(`Wrote file ${relative(ctx.cwd, fileName)}`)

    return ctx
  }
