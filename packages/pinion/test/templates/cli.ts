import { PinionContext, commander, Command } from '../../src/index.js'

interface Context extends PinionContext {
  name: string
}

const program = new Command()
  .description('A test command')
  .option('-n, --name <name>', 'Name of your project')

export const generate = (ctx: Context) =>
  Promise.resolve(ctx)
    .then(commander(program))
    .then((ctx) => ({ ...ctx, noop: true }))
