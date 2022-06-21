import { QuestionCollection } from 'inquirer'

import { PinionContext, Callable, getCallable } from '../core'
import { addTrace } from './helpers'

/**
 * Show prompts using Inquirer
 *
 * @param prompts The prompt questions to ask
 * @returns The generator context updated with the prompt results
 */
export const prompt =
  <C extends PinionContext, R extends PinionContext = C>(prompts: Callable<QuestionCollection, C>) =>
    async <T extends C>(ctx: T) => {
      const answers = await ctx.pinion.prompt(await getCallable(prompts, ctx))
      const result = {
        ...ctx,
        ...answers
      } as R

      return addTrace(result, 'prompt', answers)
    }
