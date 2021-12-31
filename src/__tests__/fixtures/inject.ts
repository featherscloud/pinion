import { RenderResult } from '../../types'

export function render(context: any): RenderResult {
  const to = 'app/Gemfile'
  const body = `gem '${context.name}'`

  return {
    body,
    to,
    inject: true,
    skipIf: `gem '${context.name}'`,
    after: "gem 'rails'",
  }
}
