#!/usr/bin/env node

'use strict'

import('../lib/cli.js').then(async ({ cli }) => {
  try {
    await cli(process.argv.slice(2)).then(() => {
      process.exit(0)
    })
  } catch (error) {
    console.error(`Oh no! Something went wrong: ${error.message}`)
  
    process.exit(1)
  }
})
