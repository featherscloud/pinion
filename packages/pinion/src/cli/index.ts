import { join } from 'path'
import { existsSync } from 'fs'
import { Command } from 'commander'
import { getContext } from '../core'
import { loadModule } from '../utils'
import { convert, ConverterContext } from './convert'

export { convert, ConverterContext }

export const cli = async (cmd: string[]) => {
  const [name, ...argv] = cmd

  if (!name) {
    throw new Error('Please specify a generator file name')
  }

  const moduleName = join(process.cwd(), name)

  if (!existsSync(moduleName)) {
    throw new Error(`The generator file ${name} does not exists`)
  }

  const { command, generate } = await loadModule(moduleName)
  const commander: Command = typeof command === 'function' ? await command(new Command()) : new Command()
  const args = commander.parse(argv, {
    from: 'user'
  })
  const ctx = getContext(args.opts(), {})

  if (typeof generate !== 'function') {
    throw new Error('The generator file must export a generate function')
  }

  return generate(ctx)
}
