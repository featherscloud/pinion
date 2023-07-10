import { generator, loadJSON, fromFile, toFile, writeJSON, mergeJSON, PinionContext } from '../../src/index'

export const generate = (ctx: PinionContext) =>
  generator(ctx)
    .then(loadJSON(fromFile(__dirname, '..', 'fixtures', 'example.json'), (example) => ({ example })))
    .then(
      writeJSON(
        (ctx) => {
          return {
            written: true,
            example: ctx.example
          }
        },
        toFile('tmp', () => ['testing.json'])
      )
    )
    .then(mergeJSON({ merged: true }, toFile('tmp', 'testing.json')))
