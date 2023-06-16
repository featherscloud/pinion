import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { Command } from 'commander'

import { getContext } from '../core'
import { loadModule } from '../utils'
import { convert, ConverterContext } from './convert'
import { gpt } from '../gpt/operation'
import { file } from '../ops'

export { convert, ConverterContext }

const { version } = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
const BASE_ACTIONS = ['help', '--help', '-h', '--version', '-V']

export const cli = async (cmd: string[]) => {
  const [action, ...argRest] = cmd
  const program = new Command()

  program.name('pinion').description('The Pinion CLI')
  program.command('<prompt> <files...>').description('Run a text prompt on a list of files.')
  program.command('run <name> [args...]').description('Run a generator file with command line arguments.')
  program.version(version)

  if (!action || BASE_ACTIONS.includes(action)) {
    program.parse(cmd, {
      from: 'user'
    })
  } else if (action === 'run') {
    const [name, ...argv] = argRest

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
  } else {
    const ctx = getContext({})
    const strings = action.split(/%s/g)
    const files = argRest.map((name) => file(name))
    const placeholderCount = strings.length - 1

    if (files.length === 0) {
      throw new Error(`You need to specify at least one file name argument`)
    }

    if (placeholderCount !== files.length) {
      throw new Error(
        `The list of filenames (${files.length}) must match the number of placeholders (${placeholderCount}) in the prompt`
      )
    }

    const runner = gpt(strings, ...files)

    return runner(ctx)
  }
}
