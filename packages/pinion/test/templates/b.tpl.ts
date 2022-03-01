import { generator } from '../../src'
import { Context } from './pinion'

export const generate = (ctx: Context) => generator(ctx)
  .then(ctx => ({
    ...ctx,
    order: [...ctx.order, 'b'],
    b: true
  }))
