import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  PinionContext,
  generator,
  runGenerators,
  renderTemplate,
  when,
  prompt,
  inject,
  toFile,
  fromFile,
  after,
  prepend,
  append,
  before,
  install,
  copyFiles
} from '../../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export interface GeneratorContext extends PinionContext {
  name: string
  order: string[]
  a: boolean
  b: boolean
  finalized: boolean
}

export type GeneratorArguments = PinionContext & Partial<Pick<GeneratorContext, 'name'>>

export const generate = (ctx: GeneratorArguments) =>
  generator(ctx)
    .then(renderTemplate('# Hello (world)', toFile('tmp', 'hello.md')))
    .then(inject('\nThis is injected after', after('Hello (world)'), toFile('tmp', 'hello.md')))
    .then(inject('This is injected before\n', before(/Hello\s/), toFile('tmp', 'hello.md')))
    .then(inject('<!-- Prepended -->', prepend(), toFile('tmp', 'hello.md')))
    .then(inject('<!-- Appended -->', append(), toFile('tmp', 'hello.md')))
    .then(
      prompt((ctx) => ({
        name: {
          type: 'input',
          when: !ctx.name
        },
        age: {
          type: 'number',
          when: !ctx.name
        }
      }))
    )
    .then(
      when(
        (ctx) => !!ctx.name && !ctx.age,
        install(['@feathersjs/feathers'], false, 'echo'),
        install(['@feathersjs/feathers'], true, 'echo')
      )
    )
    .then(copyFiles(fromFile(__dirname), toFile('tmp', 'copy')))
    .then(runGenerators(__dirname))
    .then((ctx) => ({
      ...ctx,
      finalized: true
    }))
