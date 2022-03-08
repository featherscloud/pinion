import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { getContext } from '../src'
import { convert } from '../src/cli'

describe('@feathershq/pinion/cli/convert', () => {
  it('basic conversion', async () => {
    const context = getContext({
      file: 'fixtures',
      to: 'tmp'
    }, {
      cwd: __dirname
    })

    await convert(context)

    const content = await readFile(path.join(__dirname, 'tmp', 'fixtures', 'convertable.ts.tpl.ts'))

    // eslint-disable-next-line
    assert.ok(content.toString().includes('`export const doSomething = (name: string) => \\`Hello \\${name}\\`'))
  })
})
