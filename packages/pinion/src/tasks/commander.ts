import { Callable, PinionContext, getCallable } from '../core.js'
import { Command } from 'commander'

/**
 * Parse the command line arguments using a commander instance and
 * add the parsed options to the context.
 * @param program The commander program instance
 * @returns
 */
export const commander =
  <C extends PinionContext>(program: Callable<Command, C>) =>
  async (ctx: C) => {
    const commander = await getCallable(program, ctx)

    const args = commander.parse(ctx.argv || [], {
      from: 'user'
    })

    return {
      ...ctx,
      ...args.opts()
    }
  }
