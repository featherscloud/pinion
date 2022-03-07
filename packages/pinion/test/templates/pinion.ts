import {
  PinionContext, generator, runGenerators, renderTemplate, prompt, inject, to, after, prepend, append, before
} from '../../src'

export interface Context extends PinionContext {
  name: string
  order: string[]
  a: boolean
  b: boolean
}

export const generate = (ctx: Context) => generator(ctx)
  .then(renderTemplate('# Hello world', to('tmp', 'hello.md')))
  .then(inject('\nThis is injected after', after('Hello world'), to('tmp', 'hello.md')))
  .then(inject('This is injected before\n', before('Hello world'), to('tmp', 'hello.md')))
  .then(inject('<!-- Prepended -->', prepend(), to('tmp', 'hello.md')))
  .then(inject('<!-- Appended -->', append(), to('tmp', 'hello.md')))
  .then(prompt((ctx: Context) => [{
    type: 'input',
    name: 'name',
    when: !ctx.name
  }]))
  .then(runGenerators(__dirname))
