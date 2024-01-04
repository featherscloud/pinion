import assert from 'assert'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { cli } from '../lib/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('@featherscloud/pinion/cli', () => {
  it('runs the CLI with a generator', async () => {
    const oldCwd = process.cwd()

    process.chdir(__dirname)

    const ctx = await cli(['templates/cli.ts', '--name', 'testing'])

    assert.ok(ctx.noop)
    assert.strictEqual(ctx.name, 'testing')

    process.chdir(oldCwd)
  })
})
