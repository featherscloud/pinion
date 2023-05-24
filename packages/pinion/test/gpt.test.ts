import { fromFile, toFile } from '../src'
import { gpt } from '../src/gpt/operation'

describe.only('@feathershq/pinion/gpt', () => {
  it('uses tagged template strings', async () => {
    const result = gpt`${'something'} Translate ${fromFile('readme.md')} to German as ${toFile(
      'readme.de.md'
    )} and to French as ${toFile('readme.fr.md')} pretty please`

    console.log(result)
  })
})
