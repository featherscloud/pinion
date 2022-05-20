import {
  PinionContext, generator, runGenerators, renderTemplate, when,
  prompt, inject, toFile, fromFile, after, prepend, append, before,
  install, copyFiles
} from '../../src/index'

const toHelloMd = toFile('tmp', 'hello.md')

export interface GeneratorContext extends PinionContext {
  name: string
  order: string[]
  a: boolean
  b: boolean
  finalized: boolean
}

export type GeneratorArguments = PinionContext & Partial<Pick<GeneratorContext, 'name'>>

export const generate = (ctx: GeneratorArguments) => generator(ctx)
  .then(renderTemplate('# Hello (world)', toHelloMd))
  .then(inject('\nThis is injected after', after('Hello (world)'), toHelloMd))
  .then(inject('This is injected before\n', before(/Hello\s/), toHelloMd))
  .then(inject('<!-- Prepended -->', prepend(), toHelloMd))
  .then(inject('<!-- Appended -->', append(), toHelloMd))
  .then(prompt<GeneratorArguments, GeneratorContext>(ctx => [{
    type: 'input',
    name: 'name',
    when: !ctx.name
  }]))
  .then(when<GeneratorContext>(() => true, install(['@feathersjs/feathers'], false, 'echo')))
  .then(copyFiles<GeneratorContext>(fromFile(__dirname), toFile('tmp', 'copy')))
  .then(runGenerators<GeneratorContext>(__dirname))
  .then((ctx: GeneratorContext) => ({
    ...ctx,
    finalized: true
  }))
