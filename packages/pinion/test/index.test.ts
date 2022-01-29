import assert from 'assert'
import { hello } from '../src/index'

describe('@feathersjs/pinion', () => {
  it('initializes', async () => {
    assert.strictEqual(hello(), 'Hello')
  })
})
