import { PinionContext, Callable, getCallable } from '../core.js'
import { addTrace } from './helpers.js'

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
      ? await operations.reduce((current, op) => current.then(op as any), Promise.resolve(ctx))
      : ctx

    return addTrace(result, 'when', { value })
  }
