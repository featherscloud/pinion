import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { getContext, PinionContext, runModule } from '../src/index'

const expectedFileContent =
`<!-- Prepended -->
This is injected before

# Hello (world)

This is injected after
<!-- Appended -->`

interface NamedContext extends PinionContext {
  name: string
  finalized: boolean
}

describe('@feathershq/pinion', () => {
  const rootGenerator = path.join(__dirname, 'templates', 'pinion.ts')

  it('simple', async () => {
    const initialCtx = getContext<NamedContext>({
      name: 'Simple test'
    }, {
      force: true,
      cwd: __dirname
    })
    const ctx: NamedContext = await runModule(rootGenerator, initialCtx)
    const json = require('./tmp/testing.json')

    assert.ok(ctx.finalized)
    assert.deepStrictEqual(json, {
      written: true,
      example: {
        message: 'This is an example JSON file'
      },
      merged: true
    })

    const { trace } = ctx.pinion

    assert.strictEqual(trace[0].name, 'renderTemplate')
    assert.strictEqual((trace[0].info as any).content, '# Hello (world)')

    const written = await readFile(path.join(__dirname, 'tmp', 'hello.md'))
    const writtenJSON = JSON.parse((await readFile(path.join(__dirname, 'tmp', 'testing.json'))).toString())

    assert.strictEqual(written.toString(), expectedFileContent)
    assert.deepStrictEqual(writtenJSON, {
      written: true,
      merged: true,
      example: {
        message: 'This is an example JSON file'
      }
    })
  })
})
