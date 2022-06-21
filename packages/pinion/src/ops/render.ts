import { PinionContext, Callable, getCallable } from '../core'
import { WriteFileOptions, promptWriteFile, addTrace } from './helpers'

/**
 * Renders a template to a file.
 *
 * @param template The template to render
 * @param target The target file handle, usually provided by `to()`
 * @returns The generator context
 */
export const renderTemplate =
  <C extends PinionContext>(
    template: Callable<string, C>,
    target: Callable<string, C>,
    options: Partial<WriteFileOptions> = {}
  ) =>
    async <T extends C>(ctx: T) => {
      const fileName = await getCallable(target, ctx)
      const content = await getCallable(template, ctx)
      const result = await promptWriteFile(fileName, content, ctx, options)

      return addTrace(result, 'renderTemplate', { fileName, content })
    }
