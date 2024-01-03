import assert from 'assert'
import { cli } from '../src'

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
