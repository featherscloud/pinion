import { Callable, getCallable, PinionContext } from '../core'
import { addTrace } from './helpers'

export const install =
  <C extends PinionContext>(
    dependencies: Callable<string[], C>,
    dev: boolean = false,
    packager: Callable<string, C> = 'npm'
  ) =>
    async <T extends C>(ctx: T) => {
      const dependencyList = await getCallable(dependencies, ctx)
      const packageManager = await getCallable(packager, ctx)
      const subCommand = packageManager === 'yarn' ? 'add' : 'install'
      const flags = packageManager === 'yarn' ? (dev ? ['-D'] : []) : dev ? ['--save-dev'] : ['--save']

      ctx.pinion.logger.warn(`Running ${packageManager} ${subCommand} ${flags.join(' ')}`)

      try {
        await ctx.pinion.exec(packageManager, [subCommand, ...flags, ...dependencyList], {
          cwd: ctx.cwd
        })
      } catch (err: any) {
        throw new Error(`Package manager ${packageManager} exited with error code ${err.exitCode}`)
      }

      return addTrace(ctx, 'install', { packageManager, subCommand, flags, dependencyList })
    }
