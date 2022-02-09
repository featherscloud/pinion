import { prompt as inquire, QuestionCollection } from 'inquirer'
import { getCallable, Context, Callable } from '../core'

export const prompt = <C extends Context> (prompts: Callable<QuestionCollection, C>) =>
  async <T extends C> (ctx: T) => {
    const answers = await inquire(await getCallable(prompts, ctx))

    return {
      ...ctx,
      ...answers
    }
  }
