import { relative } from 'path'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { PinionContext } from '../core'

export type WriteFileOptions = {
  force: boolean;
};

export const promptWriteFile = async <C extends PinionContext>(
  fileName: string,
  content: string | Buffer,
  ctx: C,
  options: Partial<WriteFileOptions> = {}
) => {
  const { prompt, logger } = ctx.pinion
  const force = options.force !== undefined ? options.force : ctx.pinion.force
  const relativeName = relative(ctx.cwd, fileName)

  if (existsSync(fileName) && !force) {
    const { overwrite } = await prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: `File ${relativeName} already exists. Overwrite?`
    }])

    if (!overwrite) {
      logger.warn(`Skipped file ${relativeName}`)
      return ctx
    }
  }

  await writeFile(fileName, content)
  logger.notice(`Wrote file ${relativeName}`)

  return ctx
}
