import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { relative, join } from 'path'
import chalk from 'chalk'
import open from 'open'

import { getCallable, Callable, PinionContext } from '../core'
import { FileCallable, prompt } from '../ops'
import { addTrace, promptWriteFile } from '../ops/helpers'
import client from './client'
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

export const checkLogin = async <C extends PinionContext>(ctx: C) => {
  try {
    const { user } = await client.reAuthenticate()

    return {
      ...ctx,
      user
    }
  } catch (error) {
    const { loginConfirm } = await prompt([
      {
        type: 'confirm',
        name: 'loginConfirm',
        message: `You need to sign in to ${chalk.gray(
          'feathers.cloud'
        )} to use GPT. Do you want to sign in with GitHub now?`
      }
    ])(ctx)

    if (!loginConfirm) {
      throw new Error('Login required to use GPT')
    }

    const { version } = JSON.parse(await readFile(join(__dirname, '..', '..', 'package.json'), 'utf8'))
    const login = await gpt.client.service('login').create({
      platform: 'node',
      os: process.platform,
      version
    })

    ctx.pinion.logger.log(
      chalk.gray(`\nIf a browser window did not open, visit ${chalk.underline(login.url)} to sign in.\n`)
    )

    await open(login.url)

    const timeout = login.expiry - Date.now()
    const { user } = await gpt.client.authenticate(
      { strategy: 'code', code: login.code },
      {
        connection: { timeout }
      }
    )

    return {
      ...ctx,
      user
    }
  }
}

/**
 * A tagged template string handler that returns a Pinion operation
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
        const response = await gpt.client
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

gpt.client = client
