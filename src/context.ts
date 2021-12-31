import inflection from 'inflection'
import * as changeCase from 'change-case'
import path from 'path'
import type { RunnerConfig } from './types'

const localsToCapitalize = ['name']
const localsDefaults = {
  name: 'unnamed',
}
// supports kebab-case to KebabCase
inflection.undasherize = (str) =>
  str
    .split(/[-_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('')

const helpers = {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  inflection,
  changeCase,
  path,
}

const doCapitalization = (hsh, [key, value]) => {
  hsh[key] = value

  if (localsToCapitalize.includes(key))
    hsh[helpers.capitalize(key)] = helpers.capitalize(value)

  return hsh
}

const capitalizedLocals = (locals: any) =>
  Object.entries(locals).reduce(doCapitalization, {})

const context = (locals: any, config: RunnerConfig = {}) => {
  const localsWithDefaults = {
    ...localsDefaults,
    ...config.localsDefaults,
    ...locals,
  }
  const configHelpers =
    (config &&
      (typeof config.helpers === 'function'
        ? config.helpers(locals, config)
        : config.helpers)) ||
    {}
  return Object.assign(
    localsWithDefaults,
    capitalizedLocals(localsWithDefaults),
    {
      h: { ...helpers, ...configHelpers },
    },
  )
}

export default context
