import assert from 'assert'
import { cli } from '../src'

describe('@feathershq/pinion/cli', () => {
  process.chdir(__dirname)

  it('runs the CLI with a generator', async () => {
    const ctx = await cli(['templates/cli.ts', '--name', 'testing'])

    assert.ok(ctx.noop)
    assert.strictEqual(ctx.name, 'testing')
  })
})
