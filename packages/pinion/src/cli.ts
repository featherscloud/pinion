import path from 'path'
import { parse } from 'yargs'
import { getContext, runModule } from './core'

export const cli = async (argv: string[]) => {
  const { _, ...params } = await parse(argv)
  const folders = _.map(current => `${current}`)
  const ctx = getContext(params, {})
  const moduleName = path.join(ctx.cwd, '.pinion', ...folders, 'pinion.ts')

  return runModule(moduleName, ctx)
    .then(() => ctx.pinion.logger.log('Success!'))
    .catch(ctx.pinion.logger.error)
}
