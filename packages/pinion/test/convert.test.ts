import path from 'path'
import { readFile } from 'fs/promises'
import assert from 'assert'
import { getContext } from '../src/index'
import { convert, ConverterContext } from '../src/cli/convert'

describe('@feathershq/pinion/cli/convert', () => {
  it('basic conversion', async () => {
    const context = getContext<ConverterContext>(
      {
        file: 'fixtures',
        to: 'tmp'
      },
      {
        cwd: __dirname
      }
    )

    await convert(context)

    const content = await readFile(path.join(__dirname, 'tmp', 'fixtures', 'convertable.ts.tpl.ts'))

    assert.ok(
      // eslint-disable-next-line
      content.toString().includes('`export const doSomething = (name: string) => \\`Hello \\${name}\\`')
    )
  })
})
