import { dirname, join } from 'path'
import { existsSync, readFileSync } from 'fs'

import { Command } from 'commander'
import { fileURLToPath } from 'url'
import { getContext } from './core.js'
import { loadModule } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { version } = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
const BASE_ACTIONS = ['help', '--help', '-h', '--version', '-V']

export const cli = async (cmd: string[]) => {
  const [generatorFile, ...argv] = cmd
  const program = new Command()

  program.name('pinion').description('The Pinion CLI')
  program.command('<file> [args...]').description('Run a generator file with command line arguments.')
  program.version(version)

  if (BASE_ACTIONS.includes(generatorFile)) {
    return program.parse(cmd, {
      from: 'user'
    })
  }

  if (!generatorFile) {
    throw new Error('Please specify a generator file name')
  }

  const moduleName = join(process.cwd(), generatorFile)

  if (!existsSync(moduleName)) {
    throw new Error(`The generator file ${moduleName} does not exists`)
  }

  const module = await loadModule(moduleName)
  const generate = module.default?.generate || module.generate
  const generatorContext = getContext({ argv }, {})

  if (typeof generate !== 'function') {
    throw new Error('The generator file must export a generate function')
  }

  return generate(generatorContext)
}
