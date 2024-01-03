import path from 'path'
import assert from 'assert'
import { merge, listAllFiles, loadModule, listFiles, consoleLoader } from '../src/utils'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('@featherscloud/pinion/utils', () => {
  it('listFiles with extension', async () => {
    const files = await listFiles(path.join(__dirname, 'templates'), '.tpl.ts')

    assert.strictEqual(files.length, 1)
  })

  it('listAllFiles recursive', async () => {
    const files = await listAllFiles(path.join(__dirname))

    assert.ok(files.length > 4)
  })

  it('merge', () => {
    const merged = merge(
      {
        some: { thing: true }
      },
      {
        some: { other: 'message' },
        value: { deep: true }
      }
    )

    assert.deepStrictEqual(merged, {
      some: { thing: true, other: 'message' },
      value: { deep: true }
    })
  })

  it('consoleLoader', () => {
    const stopLoader = consoleLoader()

    assert.strictEqual(typeof stopLoader, 'function')

    stopLoader()
  })

  describe('loadModule', () => {
    it('loads .js when available and no extension is given', async () => {
      const { doSomething } = await loadModule(path.join(__dirname, 'fixtures', 'convertable'))

      assert.strictEqual(doSomething('Feathers'), 'Yo Feathers')
    })

    it('loads .ts and compiles when full path is given', async () => {
      const { doSomething } = await loadModule(path.join(__dirname, 'fixtures', 'convertable.ts'))

      assert.strictEqual(doSomething('Feathers'), 'Hello Feathers')
    })
  })
})
