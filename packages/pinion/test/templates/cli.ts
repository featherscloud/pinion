import { PinionContext, Command, generator } from '../../src/index'

interface Context extends PinionContext {
  name: string
}

export const command = (program: Command) =>
  program.description('A test command').option('-n, --name <name>', 'Name of your project')

export const generate = (ctx: Context) => generator(ctx).then((ctx) => ({ ...ctx, noop: true }))
