import { generator, loadJSON, fromFile, toFile, writeJSON, mergeJSON } from '../../src/index'
import { Context } from './pinion'

interface JSONContext extends Context {
  example: any
}

export const generate = (ctx: JSONContext) => generator(ctx)
  .then(loadJSON(fromFile(__dirname, '..', 'fixtures', 'example.json'), example => ({ example })))
  .then(writeJSON((ctx: JSONContext) => {
    return {
      written: true,
      example: ctx.example
    }
  }, toFile('tmp', () => ['testing.json'])))
  .then(mergeJSON({ merged: true }, toFile('tmp', 'testing.json')))
