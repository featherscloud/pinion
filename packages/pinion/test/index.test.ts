import path from 'path'
import assert from 'assert'
import { loadModule } from '../src/index'

describe('@feathersjs/pinion', () => {
  it.skip('renders a simple template', async () => {
    const generate = await loadModule(path.join(__dirname, './templates/simple.tpl.ts'))
    const result = await generate({
      cwd: path.join(__dirname, 'tmp'),
      name: 'A test',
      description: 'Testing'
    })

    assert.ok(result)
  })
})
