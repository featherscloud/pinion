import { prompt, PromptModule } from 'inquirer'
import yargs, { Argv } from 'yargs'
import { existsSync } from 'fs'
import { relative } from 'path'
import { writeFile } from 'fs/promises'

import { loadModule } from './utils'

export { Argv, yargs }

export interface Logger {
  warn: (msg: string) => void
  error: (msg: string) => void
  log: (msg: string) => void
}

export type Configuration = {
  cwd: string
  logger: Logger
  force: boolean
  prompt: PromptModule
  exec: (sh: string, args: string) => number
}

export type PinionContext = {
  cwd: string
  _?: string[]
  pinion: Configuration
}

export type ContextCallable<T, C extends PinionContext> = (ctx: C) => T|Promise<T>
export type Callable<T, C extends PinionContext> = T|ContextCallable<T, C>
export type Promisable<T> = T | Promise<T>

export const getCallable = async <T, C extends PinionContext> (callable: Callable<T, C>, context: C) =>
  typeof callable === 'function' ? (callable as ContextCallable<T, C>)(context) : callable

export const mapCallables = <X, C extends PinionContext> (callables: Callable<X, C>[], context: C) =>
  Promise.all(callables.map(callable => getCallable(callable, context)))

export const getConfig = (initialConfig?: Partial<Configuration>) : Configuration => ({
  prompt,
  logger: console,
  cwd: process.cwd(),
  force: false,
  exec: (command: string, args: string) => {
    const spawn = require('execa')

    return spawn(command, args, {
      stdio: 'inherit'
    })
  },
  ...initialConfig
})

export const promptWriteFile = async <C extends PinionContext> (
  fileName: string,
  content: string|Buffer,
  ctx: C
) => {
  const { prompt, force, logger } = ctx.pinion

  if (existsSync(fileName) && !force) {
    const { overwrite } = await prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: `File ${relative(ctx.cwd, fileName)} already exists. Overwrite?`
    }])

    if (!overwrite) {
      logger.log(`Skipped file ${relative(ctx.cwd, fileName)}`)
      return ctx
    }
  }

  await writeFile(fileName, content)
  logger.log(`Wrote file ${relative(ctx.cwd, fileName)}`)

  return ctx
}

export const getContext = <T> (initialCtx: any, initialConfig: Partial<Configuration> = {}) => {
  const pinion = getConfig(initialConfig)

  return {
    cwd: pinion.cwd,
    ...initialCtx,
    pinion
  } as T
}

export const generator = async <T extends PinionContext> (initialContext: T) => initialContext

export const runModule = async (file: string, ctx: PinionContext) => {
  const { generate } = await loadModule(file)

  return generate(ctx)
}
