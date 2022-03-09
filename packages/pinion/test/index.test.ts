import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { getContext, PinionContext, runModule } from '../src'

const expectedFileContent =
`<!-- Prepended -->
This is injected before

# Hello world

This is injected after
<!-- Appended -->`

interface NamedContext extends PinionContext {
  name: string
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
    const ctx = await runModule(rootGenerator, initialCtx)

    assert.ok(ctx.second)
    assert.deepStrictEqual(ctx.example, {
      message: 'This is an example JSON file'
    })

    const written = await readFile(path.join(__dirname, 'tmp', 'hello.md'))
    const writtenJSON = JSON.parse((await readFile(path.join(__dirname, 'tmp', 'testing.json'))).toString())

    assert.strictEqual(written.toString(), expectedFileContent)
    assert.deepStrictEqual(writtenJSON, {
      written: true,
      example: {
        message: 'This is an example JSON file'
      }
    })
  })
})
