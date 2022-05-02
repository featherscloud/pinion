import { PinionContext, Callable, getCallable } from '../core'

/**
 * Conditionally run an operation
 *
 * @param condition The condition to evaluate
 * @param operation The operation to run when the condition is true
 * @returns The updated context
 */
export const when = <C extends PinionContext> (
  condition: Callable<boolean, C>,
  operation: (ctx: C) => Promise<C>
) => async <T extends C> (ctx: T) => {
    const value = await getCallable(condition, ctx)

    return value ? operation(ctx) : ctx
  }
