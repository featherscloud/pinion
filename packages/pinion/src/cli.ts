import path from 'path'
import { parse } from 'yargs'
import { getContext, runModule } from './core'

export const cli = async (argv: string[]) => {
  const params = await parse(argv)
  const ctx = getContext(params, {})
  const moduleName = path.join(ctx.cwd, '.pinion', 'pinion.ts')

  return runModule(moduleName, ctx)
    .then(() => ctx.pinion.logger.log('Success!'))
    .catch(ctx.pinion.logger.error)
}
