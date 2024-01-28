import { describe, it } from 'vitest'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { cli } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('@featherscloud/pinion/cli', () => {
  it('runs the CLI with a generator and command line arguments', async () => {
    const ctx = await cli(['packages/pinion/test/templates/cli.ts', '--name', 'testing'])

    assert.ok(ctx.noop)
    assert.strictEqual(ctx.name, 'testing')
  })

  it('errors without generator file', async () => {
    try {
      await cli([])
    } catch (error) {
      assert.strictEqual(error.message, 'Please specify a generator file name')
    }
  })
})
