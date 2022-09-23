import { Callable, getCallable, PinionContext } from '../core'
import { addTrace } from './helpers'

/**
 * A utility function to run a command in a child process using `execa`.
 *
 * The `execa` method spawns a new process using the given command, with command-line arguments in args. If omitted, args defaults to an empty array.
 *
 * The options argument is passed directly to the underlying `execa` function. See the `execa` documentation for more details:
 * https://github.com/sindresorhus/execa#readme
 *
 * @param command The command-line command to run.
 * @param args The command-line arguments
 * @param options options for execa
 * @returns The child process
 */
export const utilExec =
  <C extends PinionContext>(
    command: Callable<string, C>,
    args?: Callable<string | string[], C>,
    options?: Callable<import('execa').Options, C>
  ) =>
    async <T extends C>(ctx: T) => {
      const cmd = await getCallable(command, ctx)
      const cmdArgOrArgs = await getCallable(args, ctx)
      const opts = await getCallable(options, ctx)

      let cmdArgs: string[] = []

      if (cmdArgOrArgs) {
        if (Array.isArray(cmdArgOrArgs)) {
          cmdArgs = cmdArgOrArgs
        } else {
          cmdArgs = [cmdArgOrArgs]
        }
      }

      const cmdOptions = {
        cwd: ctx.cwd,
        ...opts
      }

      ctx.pinion.logger.warn(`Running ${cmd} ${cmdArgs.join(' ')}`)

      try {
        return await ctx.pinion.exec(cmd, cmdArgs, cmdOptions)
      } catch (err: any) {
        throw new Error(`Command ${cmd} exited with error code ${err.exitCode}`)
      }
    }

/**
 * Run a child process using `execa`.
 *
 * The `execa` method spawns a new process using the given command, with command-line arguments in args. If omitted, args defaults to an empty array.
 *
 * The options argument is passed directly to the underlying `execa` function. See the `execa` documentation for more details:
 * https://github.com/sindresorhus/execa#readme
 *
 * @param command The command-line command to run.
 * @param args The command-line arguments
 * @param options options for execa
 * @returns The current process
 */
export const exec =
  <C extends PinionContext>(
    command: Callable<string, C>,
    args?: Callable<string | string[], C>,
    options?: Callable<import('execa').Options, C>
  ) =>
    async <T extends C>(ctx: T) => {
      const cmd = await getCallable(command, ctx)
      const cmdArgOrArgs = await getCallable(args, ctx)
      const opts = await getCallable(options, ctx)

      let cmdArgs: string[] = []

      if (cmdArgOrArgs) {
        if (Array.isArray(cmdArgOrArgs)) {
          cmdArgs = cmdArgOrArgs
        } else {
          cmdArgs = [cmdArgOrArgs]
        }
      }

      await utilExec<C>(cmd, cmdArgOrArgs, opts)(ctx)

      return addTrace(ctx, 'exec', { cmd, args: cmdArgs, options: opts })
    }
