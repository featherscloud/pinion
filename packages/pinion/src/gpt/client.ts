//@ts-ignore
import createClient from '@feathershq/api'
import { readFile } from 'fs/promises'
import { join } from 'path'
import chalk from 'chalk'
import open from 'open'

import { PinionContext } from '../core'
import { prompt } from '../ops'

export const client = createClient(
  process.env.PINION_DEV ? 'http://localhost:3030' : 'https://app.feathers.cloud'
)

export const getUser = async () => {
  try {
    const { user } = await client.reAuthenticate()

    return user
  } catch (error) {
    return null
  }
}

export const checkLogin = async <C extends PinionContext>(ctx: C) => {
  try {
    const { user } = await client.reAuthenticate()

    return {
      ...ctx,
      user
    }
  } catch (error: any) {
    if (error.code === 401) {
      const { loginConfirm } = await prompt<C & { loginConfirm?: boolean }>([
        {
          type: 'confirm',
          name: 'loginConfirm',
          message: `You need to sign in to ${chalk.gray(
            'feathers.cloud'
          )} to use GPT. Do you want to sign in with GitHub now?`
        }
      ])(ctx)

      if (!loginConfirm) {
        throw new Error('You must be signed in to proceed')
      }

      const { version } = JSON.parse(await readFile(join(__dirname, '..', '..', 'package.json'), 'utf8'))
      const login = await client.service('login').create({
        platform: 'node',
        os: process.platform,
        version
      })

      ctx.pinion.logger.log(
        chalk.gray(`\nIf a browser window did not open, visit ${chalk.underline(login.url)} to sign in.\n`)
      )

      await open(login.url)

      // const timeout = login.expiry - Date.now()
      const { user } = await client.authenticate({ strategy: 'code', code: login.code })

      return {
        ...ctx,
        user
      }
    }
    throw error
  }
}

export const logout = async <C extends PinionContext>(ctx: C) => {
  await client.logout()
  delete (ctx as any).user
  ctx.pinion.logger.log('You are now logged out 👋')
  return ctx
}

export const subscribe = async <C extends PinionContext>(ctx: C) =>
  Promise.resolve(ctx).then(async (ctx) => {
    const checkout = await client.service('checkout').create({
      name: 'pinion-gpt'
    })

    ctx.pinion.logger.log(
      chalk.gray(
        `\nIf a browser window did not open, visit ${chalk.underline(
          checkout.url
        )} to upgrade, then run your command again.\n`
      )
    )

    await open(checkout.url)

    return ctx
  })

export const handlePayment = async <C extends PinionContext>(error: any, ctx: C) => {
  const { signupConfirm } = await prompt<C & { signupConfirm?: boolean }>([
    {
      type: 'confirm',
      name: 'signupConfirm',
      message: `You have exceeded your trial limit. Do you want to upgrade now?`
    }
  ])(ctx)

  if (!signupConfirm) {
    throw error
  }

  return subscribe(ctx)
}
