import { Callable, getCallable, PinionContext } from '../core.js'
import { addTrace } from './helpers.js'

export const exec =
  <C extends PinionContext>(cmd: Callable<string, C>, _args: string[] = []) =>
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
