import { PinionContext, generator, runGenerators, renderTemplate, prompt, to } from '../../src'

export interface Context extends PinionContext {
  name: string
  order: string[]
  a: boolean
  b: boolean
}

export const generate = (ctx: Context) => generator(ctx)
  .then(renderTemplate('# Hello world', to('tmp', 'hello.md')))
  .then(prompt((ctx: Context) => [{
    type: 'input',
    name: 'name',
    when: !ctx.name
  }]))
  .then(runGenerators(__dirname))
