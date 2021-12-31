import { ExecaReturnValue } from 'execa'

export interface Logger {
  ok: (msg: string) => void
  notice: (msg: string) => void
  warn: (msg: string) => void
  err: (msg: string) => void
  log: (msg: string) => void
  colorful: (msg: string) => void
}

export interface Prompter<Q = any, T = any> {
  prompt: (arg0: Q) => Promise<T>
}

export type RenderAttributes = {
  to: string | null
  inject?: boolean
  skipIf?: string | RegExp
  // locations
  prepend?: boolean
  append?: boolean
  before?: string | RegExp
  after?: string | RegExp
  atLine?: number
  unlessExists?: boolean
  force?: boolean
  from?: string
  eofLast?: boolean
  sh?: string
  message?: string
  cmd?: string
}

export interface RenderedAction {
  attributes: RenderAttributes
  body: string
}

export type Arguments = Record<string, any>

export type OpType = 'inject' | 'add' | 'shell'
export type OpStatus =
  | 'added'
  | 'executed'
  | 'inject'
  | 'ignored'
  | 'skipped'
  | 'error'

export type PromptOptions<H = {}, Q = any, T = any> = {
  prompter: Prompter<Q, T>
  inquirer: Prompter<Q, T>
  args: Arguments
  config: RunnerConfig<H>
}

export type RunnerArgs = {
  generator: string
  action: string
  args?: Arguments
  subaction?: string
  name?: string
}

export interface RunnerConfig<H = {}> {
  exec?: (sh: string, body: string) => Promise<ExecaReturnValue<string>>
  templates?: string
  cwd?: string
  logger?: Logger
  debug?: boolean
  helpers?: H
  localsDefaults?: any
  createPrompter?: <Q, T>() => Prompter<Q, T>
}

export interface ResolverIO {
  exists: (arg0: string) => Promise<boolean>
  load: (arg0: string) => Promise<Record<string, any>>
  none: (arg0: string) => Record<string, any>
}

export type ActionResult = any

export type ParamsResult = {
  templates: string
  generator: string
  action: string
  subaction?: string
  actionfolder?: string
  name?: string
  dry?: boolean
} & Arguments

export type PromptList = any[]

export interface InteractiveHook<H = {}> {
  params?(args: Arguments): Promise<Arguments>
  prompt?<Q, T>(promptArgs: PromptOptions<H, Q, T>): Promise<Arguments>
  // eslint-disable-next-line
  rendered?(result: EngineResult, config: RunnerConfig<H>): Promise<EngineResult>
}

export type HookModule<H = {}> = PromptList | InteractiveHook<H> | null

export interface EngineResult {
  actions: ActionResult[]
  args: ParamsResult
  hookModule: HookModule
}

export type RenderFile = (context: Record<string, any>) => RenderResult

export type RenderResult = RenderAttributes & {
  body: string
}

export type GeneratorContext<H extends {}, T extends {}> = {
  h: H
  action: string
  actionfolder: string
  cwd: string
  generator: string
  templates: string
} & T

export interface RunnerResult {
  success: boolean
  time: number
  actions: ActionResult[]
  failure?: {
    message: string
    availableActions: string[]
  }
}
