import { Question, QuestionCollection } from 'inquirer'
import { PinionContext, Callable, getCallable } from '../core'
import { addTrace } from './helpers'

export type InferAnswerType<Q extends Question> = Q extends { type: 'input' }
  ? string
  : Q extends { type: 'list' }
  ? string
  : Q extends { type: 'rawlist' }
  ? string
  : Q extends { type: 'number' }
  ? number
  : Q extends { type: 'password' }
  ? string
  : Q extends { type: 'confirm' }
  ? boolean
  : Q extends { type: 'checkbox' }
  ? string[]
  : Q extends { type: 'editor' }
  ? string
  : unknown

export type InferAnswerTypes<Q extends QuestionCollection> = Q extends ReadonlyArray<
  Question & { name: string }
>
  ? { [K in Q[number] as K['name']]: InferAnswerType<K> }
  : Q extends Array<Question>
  ? unknown
  : {
      [K in keyof Q]: InferAnswerType<Q[K]>
    }

/**
 * Show prompts using Inquirer
 *
 * @param prompts The prompt questions to ask
 * @returns The generator context updated with the prompt results
 */
export const prompt =
  <C extends PinionContext, Q extends QuestionCollection = QuestionCollection>(prompts: Callable<Q, C>) =>
  async (ctx: C) => {
    const answers = await ctx.pinion.prompt(await getCallable(prompts, ctx))
    const result = {
      ...ctx,
      ...answers
    } as C & InferAnswerTypes<Q>

    return addTrace(result, 'prompt', answers)
  }

/**
 * Get the types for the answers from a prompt() function
 */
export type Answers<T extends ReturnType<typeof prompt>> = ReturnType<T> extends Promise<infer U> ? U : never
