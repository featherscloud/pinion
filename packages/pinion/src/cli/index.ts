import path from 'path'
import yargs from 'yargs'
import { getContext } from '../core'
import { loadModule } from '../utils'
import { convert, ConverterContext } from './convert'

export { convert, ConverterContext }

export const cli = async (cmd: string[]) =>
  yargs(cmd)
    .scriptName('pinion')
    .usage('$0 <command> [options]')
    .command(
      'convert [file]',
      'Convert a file or folder into a generator',
      (yargs) =>
        yargs
          .positional('file', {
            type: 'string',
            describe: 'The file or folder to convert',
            demandOption: true
          })
          .option('to', {
            describe: 'The path or filename to write the generator to',
            default: '.pinion'
          }),
      (argv) => {
        const ctx = getContext<ConverterContext>(argv, {})

        return convert(ctx)
      }
    )
    .command(
      'generate',
      'Run your local generator',
      async (yargs) => {
        const moduleName = path.join(process.cwd(), '.pinion', 'pinion.ts')
        const { command } = await loadModule(moduleName)

        return typeof command === 'function' ? command(yargs) : yargs
      },
      async (argv) => {
        const moduleName = path.join(process.cwd(), '.pinion', 'pinion.ts')
        const { generate } = await loadModule(moduleName)
        const ctx = getContext(argv, {})

        return generate(ctx)
      }
    )
    .help().argv
