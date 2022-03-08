import path from 'path'
import assert from 'assert'
import { merge, listFiles } from '../src/utils'

describe('@feathershq/pinion/utils', () => {
  it('listFiles', async () => {
    const files = await listFiles(path.join(__dirname, 'templates'))

    assert.ok(files.includes(
      path.join(__dirname, 'templates', 'pinion.ts')
    ))
  })

  it('merge', () => {
    const merged = merge({
      some: { thing: true }
    }, {
      some: { other: 'message' },
      value: { deep: true }
    })

    assert.deepStrictEqual(merged, {
      some: { thing: true, other: 'message' },
      value: { deep: true }
    })
  })
})