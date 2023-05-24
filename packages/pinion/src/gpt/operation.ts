import { PinionContext } from '../core'

export const gpt =
  (strings: TemplateStringsArray, ...values: any[]) =>
  async <T extends PinionContext>(ctx: T) => {
    let result = ''

    // Loop through the strings array
    for (let i = 0; i < strings.length; i++) {
      console.log(i, strings[i], values[i])
      result += strings[i]
    }

    console.log(result, strings, values)

    return values
  }
