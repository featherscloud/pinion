import { generator } from '../../src/index'
import { Context } from './pinion'

export const generate = (ctx: Context) => generator(ctx)
  .then(ctx => ({
    ...ctx,
    second: true
  }))
