import { spawn, SpawnOptions } from 'child_process'
import { prompt, PromptModule } from 'inquirer'
import yargs, { Argv } from 'yargs'

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
  exec: (command: string, args: string[], options?: SpawnOptions) => Promise<number>
}

export type PinionContext = {
  cwd: string
  _?: (number|string)[]
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
  exec: (command: string, args: string[], options?: SpawnOptions) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    })

    return new Promise((resolve, reject) => {
      child.once('exit', code => code === 0 ? resolve(code) : reject(code))
    })
  },
  ...initialConfig
})

export const getContext = <T extends PinionContext> (initialCtx: Partial<T>, initialConfig: Partial<Configuration> = {}) => {
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
