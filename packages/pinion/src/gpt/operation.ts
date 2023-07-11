import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { relative, join } from 'path'
import chalk from 'chalk'

import { getCallable, Callable, PinionContext } from '../core'
import { FileCallable } from '../ops'
import { addTrace, promptWriteFile } from '../ops/helpers'
import { checkLogin, client, handlePayment } from './client'
import { consoleLoader } from '../utils'

export type FileList = { [key: string]: string }

export type PromptData = {
  type: 'file'
  prompt: string
  data: FileList
}

/**
 * Extracts prompt data (prompt, files and type) from a tagged template string.
 *
 * @param ctx The current Pinion context
 * @param strings The templates string parts
 * @param values The tagged values
 * @returns prompt data that can be sent to the cloud
 */
export const getPromptData = async <C extends PinionContext>(
  ctx: C,
  strings: TemplateStringsArray | string[],
  ...values: Callable<string, C>[]
) => {
  let prompt = ''
  let files: FileList = {}

  for (let i = 0; i < strings.length; i++) {
    prompt += strings[i]

    if (i < values.length) {
      const callable = values[i]
      const value = (await getCallable(callable, ctx)) || ''
      const options = typeof callable === 'function' && (callable as FileCallable).file

      if (options) {
        const relativeName = relative(ctx.cwd, value)
        const fileContent = existsSync(value) ? (await readFile(value)).toString() : ''

        prompt += `${options.prompt} ${relativeName}`
        files[relativeName] = fileContent
      } else {
        prompt += value
      }
    }
  }

  const promptData: PromptData = {
    type: 'file',
    prompt,
    data: files
  }

  return promptData
}

/**
 * Run a Pinion GPT task using a template string.
 *
 * @param strings
 * @param values
 * @returns
 */
export const gpt =
  <C extends PinionContext>(strings: TemplateStringsArray | string[], ...values: Callable<string, C>[]) =>
  async (ctx: C) =>
    Promise.resolve(ctx)
      .then(checkLogin)
      .then(async (ctx) => {
        const request = await getPromptData(ctx, strings, ...values)

        ctx.pinion.logger.notice(`Running "${chalk.grey(request.prompt)}"`)

        const stopLoader = consoleLoader()
        const response = await client
          .service('prompt')
          .create(request)
          .catch((error: unknown) => {
            stopLoader()
            throw error
          })

        stopLoader()

        if (response.files) {
          const fileList = response.files
          for (const name of Object.keys(fileList)) {
            const fileContent =
              typeof fileList[name] === 'object' ? JSON.stringify(fileList[name]) : fileList[name]

            await promptWriteFile(join(ctx.cwd, name), fileContent, ctx)
          }
        }

        return addTrace(ctx, 'gpt', { request, response })
      })
      .catch(async (error) => {
        if (error.code === 402) {
          return handlePayment(error, ctx)
        }

        throw error
      })
