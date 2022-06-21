import { PinionContext, Callable, getCallable } from '../core'
import { addTrace } from './helpers'

/**
 * Conditionally run an operation
 *
 * @param condition The condition to evaluate
 * @param operation The operation to run when the condition is true
 * @returns The updated context
 */
export const when =
  <C extends PinionContext>(condition: Callable<boolean, C>, ...operations: ((ctx: C) => Promise<C>)[]) =>
    async (ctx: C) => {
      const value = await getCallable(condition, ctx)
      const result = value
        ? await operations.reduce((current, op) => current.then(op), Promise.resolve(ctx))
        : ctx

      return addTrace(result, 'when', { value })
    }
