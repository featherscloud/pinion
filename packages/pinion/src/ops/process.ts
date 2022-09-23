import { Callable, getCallable, PinionContext } from '../core'
import { addTrace } from './helpers'

/**
 * Run a child process using node's native `child_process.spawn()` function.
 * 
 * The `child_process.spawn()` method spawns a new process using the given command, with command-line arguments in args. If omitted, args defaults to an empty array.
 * 
 * The spawnOptions argument is passed directly to the underlying child_process.spawn() function. See the Node.js documentation for more details:
 * https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
 * 
 * @param command The command-line command to run.
 * @param args The command-line arguments
 * @param spawnOptions options for child_process.spawn()
 * @returns The current context
 */
export const exec =
  <C extends PinionContext>(
    command: Callable<string, C>,
    args?: Callable<string | string[], C>,
    spawnOptions?: Callable<import('child_process').SpawnOptions, C>
  ) =>
    async <T extends C>(ctx: T) => {
      const cmd = await getCallable(command, ctx)
      const cmdArgOrArgs = await getCallable(args, ctx)
      const options = await getCallable(spawnOptions, ctx)

      let cmdArgs: string[] = [];
      
      if (cmdArgOrArgs) {
        if (Array.isArray(cmdArgOrArgs)) {
          cmdArgs = cmdArgOrArgs
        } else {
          cmdArgs = [cmdArgOrArgs]
        }
      }

      const cmdSpawnOptions = { 
        cwd: ctx.cwd,
        ...options 
      }

      ctx.pinion.logger.warn(`Running ${cmd} ${cmdArgs.join(' ')}`)

      const exitCode = await ctx.pinion.exec(cmd, cmdArgs, cmdSpawnOptions)

      if (exitCode !== 0) {
        throw new Error(`Command ${cmd} exited with error code ${exitCode}`)
      }

      return addTrace(ctx, 'exec', { cmd, cmdArgs, cmdSpawnOptions })
    }