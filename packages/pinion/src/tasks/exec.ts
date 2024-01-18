import { Callable, getCallable, PinionContext } from '../core.js'
import { addTrace } from './helpers.js'

/**
 * Run a command with arguments.
 *
 * @param cmd  The command to run
 * @param _args The arguments for the command
 * @returns The current context
 */
export const exec =
  <C extends PinionContext>(cmd: Callable<string, C>, _args: Callable<string[], C> = []) =>
  async (ctx: C) => {
    const command = await getCallable(cmd, ctx)
    const args = await getCallable(_args, ctx)

    ctx.pinion.logger.notice(`Running ${command} ${args.join(' ')}`)

    const exitCode = await ctx.pinion.exec(command, args, {
      cwd: ctx.cwd
    })

    if (exitCode !== 0) {
      throw new Error(`Command "${command}" exited with error code ${exitCode}`)
    }

    return addTrace(ctx, 'exec', { command, args })
  }
