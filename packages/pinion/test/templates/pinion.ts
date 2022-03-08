import {
  PinionContext, generator, runGenerators, renderTemplate,
  prompt, inject, toFile, after, prepend, append, before
} from '../../src'

const toHelloMd = toFile('tmp', 'hello.md')

export interface Context extends PinionContext {
  name: string
  order: string[]
  a: boolean
  b: boolean
}

export const generate = (ctx: Context) => generator(ctx)
  .then(renderTemplate('# Hello world', toHelloMd))
  .then(inject('\nThis is injected after', after('Hello world'), toHelloMd))
  .then(inject('This is injected before\n', before('Hello world'), toHelloMd))
  .then(inject('<!-- Prepended -->', prepend(), toHelloMd))
  .then(inject('<!-- Appended -->', append(), toHelloMd))
  .then(prompt((ctx: Context) => [{
    type: 'input',
    name: 'name',
    when: !ctx.name
  }]))
  .then(runGenerators(__dirname))
