import assert from 'assert'
import { listFiles } from '../src/fs'

describe('@feathersjs/pinion/fs', () => {
  it('list files', async () => {
    const files = await listFiles('test/templates', '.tpl.ts')

    assert.equal(files.length, 2)
    assert.ok(files[0].endsWith('index.tpl.ts'))
    assert.ok(files[1].endsWith('simple.tpl.ts'))
  })
})
