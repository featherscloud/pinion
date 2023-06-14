import assert from 'assert'
import { join } from 'path'
import { readFile } from 'fs/promises'

import { PinionContext, fromFile, toFile } from '../src'
import { Callable, file, getContext } from '../src'
import { getPromptData, gpt } from '../src/gpt/operation'

interface MyContext extends PinionContext {
  name: string
}

describe('@feathershq/pinion/gpt', () => {
  it('getPromptData', async () => {
    const ctx = getContext<MyContext>({
      cwd: join(__dirname, '..'),
      name: 'Dave'
    })
    const tagger = (strings: TemplateStringsArray, ...values: Callable<string, MyContext>[]) =>
      getPromptData(ctx, strings, ...values)
    const fileContent = await readFile(join(__dirname, '..', 'readme.md'), 'utf-8')
    const results = await tagger`Hey ${({ name }) => name}, I want to translate ${fromFile(
      'readme.md'
    )} to German ${toFile('docs', 'readme.de.md')}`

    assert.deepStrictEqual(results, {
      type: 'file',
      prompt: 'Hey Dave, I want to translate from file readme.md to German to file docs/readme.de.md',
      data: {
        'readme.md': fileContent,
        'docs/readme.de.md': ''
      }
    })
  })

  if (process.env.PINION_API_KEY) {
    it('gpt', async () => {
      const ctx = getContext<MyContext>({
        name: 'Dave'
      })
      const result = await Promise.resolve(ctx).then(
        gpt`Translate ${file('readme.md')} to German ${toFile('test', 'tmp', 'readme.de.md')}`
      )

      console.log(result)
    })
  }
})
