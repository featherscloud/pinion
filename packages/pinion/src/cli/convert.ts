import { join, dirname, relative } from 'path'
import { stat, readFile, writeFile, mkdir } from 'fs/promises'
import { PinionContext } from '../core'
import { listAllFiles } from '../utils'

export interface ConverterContext extends PinionContext {
  file: string
  to: string
}

const conversionRegex = /(`|\$\{)/g
const convertContent = (content: string) => content.replace(conversionRegex, '\\$1')
const template = (content: string, fileName: string) =>
  `import { PinionContext, generator, renderTemplate, to } from '@feathershq/pinion'

export interface Context extends PinionContext {
  // Put additional context variables here
} 

const template = (ctx: Context) =>
\`${convertContent(content)}\`

export const generate = (ctx: Context) => generator(ctx)
  .then(renderTemplate(template, to('${fileName}')))
`

export const convert = async (ctx: ConverterContext) => {
  const { file, to, cwd, pinion } = ctx
  const convertFile = async (current: string) => {
    const relativeName = relative(cwd, current)
    const target = join(cwd, to, `${relativeName}.tpl.ts`)
    const content = (await readFile(current)).toString()

    await mkdir(dirname(target), {
      recursive: true
    })
    await writeFile(target, template(content, relativeName))

    pinion.logger.log(`Converted file ${relativeName}`)
  }
  const convertDirectory = async (directory: string) => {
    const files = await listAllFiles(directory)

    await Promise.all(
      files.map(async (file) =>
        (await stat(file)).isDirectory() ? convertDirectory(file) : convertFile(file)
      )
    )
  }

  const fileName = join(cwd, file)
  const handle = await stat(fileName)

  if (handle.isDirectory()) {
    return convertDirectory(fileName)
  }

  if (handle.isFile()) {
    return convertFile(fileName)
  }

  throw new Error(`${file} is not a valid file`)
}
