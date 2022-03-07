import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { getContext, runModule } from '../src'

const expectedFileContent =
`<!-- Prepended -->
# Hello world

This is injected
<!-- Appended -->`

describe('@feathershq/pinion', () => {
  const rootGenerator = path.join(__dirname, 'templates', 'pinion.ts')

  it('simple', async () => {
    const initialCtx = getContext({
      name: 'Simple test'
    }, {
      force: true,
      cwd: __dirname
    })
    const ctx = await runModule(rootGenerator, initialCtx)

    assert.deepStrictEqual(ctx.generated, {
      a: true,
      b: true
    })

    const written = await readFile(path.join(__dirname, 'tmp', 'hello.md'))

    assert.strictEqual(written.toString(), expectedFileContent)
  })
})
