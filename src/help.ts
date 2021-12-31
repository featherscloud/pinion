import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import type { Logger } from './types'

const pkg = require('../package.json')

const VERSION = pkg.version

const availableActions = (templates: string) => {
  const generators = fs
    .readdirSync(templates)
    .filter((_) => fs.lstatSync(path.join(templates, _)).isDirectory())
  return generators.reduce((acc, generator) => {
    const actions = fs.readdirSync(path.join(templates, generator))
    acc[generator] = actions
    return acc
  }, {})
}

const printHelp = (templates: string, logger: Logger) => {
  logger.log(`Pinion v${VERSION}`)
  logger.log('\nAvailable actions:')
  if (!templates) {
    logger.log(`No generators or actions found. 

      This means I didn't find a _templates folder right here, 
      or anywhere up the folder tree starting here.

      Here's how to start using Pinion:

      $ pinion init self
      $ pinion with-prompt new --name my-generator

      (edit your generator in _templates/my-generator)

      $ pinion my-generator 
      
      `)
    return
  }
  Object.entries(availableActions(templates)).forEach(([k, v]) => {
    // @ts-ignore
    logger.log(`${chalk.bold(k)}: ${v.join(', ')}`)
  })
}

export { availableActions, printHelp, VERSION }
