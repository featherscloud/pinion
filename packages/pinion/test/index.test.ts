import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { run } from '../src'

describe('@feathershq/pinion', () => {
  it('simple', async () => {
    const ctx = await run(path.join(__dirname, 'templates', 'pinion.ts'), {
      name: 'Simple test'
    }, {
      force: true,
      cwd: __dirname
    })

    assert.strictEqual(ctx.a, true)
    assert.strictEqual(ctx.b, true)
    assert.deepStrictEqual(ctx.order, ['a', 'b'])

    const written = await readFile(path.join(__dirname, 'tmp', 'hello.md'))

    assert.strictEqual(written.toString(), '# Hello world')
  })
})
