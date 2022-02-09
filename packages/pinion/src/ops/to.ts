import path from 'path'
import { Context, Callable, getCallable } from '../core'

/**
 * Return an absolute filename
 *
 * @param target The (relative) filename
 * @returns The absolute resolved filename
 */
export const to = <C extends Context> (target: Callable<string, C>) =>
  async <T extends C> (ctx: T) => path.resolve(ctx.cwd, await getCallable(target, ctx))
