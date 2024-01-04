#!/usr/bin/env node

'use strict'
import chalk from 'chalk'

import('../lib/cli.js').then(async ({ cli }) => {
  try {
    await cli(process.argv.slice(2)).then(() => {
      process.exit(0)
    })
  } catch (error) {
    console.error(`${chalk.red('Oh no! Something went wrong')}: ${error.message}`)
  
    process.exit(1)
  }
})
