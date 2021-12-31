import fs from 'fs-extra'
import getParams from './params'
import getHookModule from './hookmodule'

import type {
  EngineResult,
  InteractiveHook,
  RunnerArgs,
  RunnerConfig,
} from './types'

export class ShowHelpError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ShowHelpError.prototype)
  }
}

const engine = async (
  runnerArgs: RunnerArgs,
  config: RunnerConfig,
): Promise<EngineResult> => {
  const { cwd, templates, logger } = config
  const hookModule = await getHookModule(config, runnerArgs)

  const params = await getParams(config, runnerArgs, hookModule)

  const args = Object.assign(params, { cwd })
  const { generator, action, actionfolder } = args

  if (args.h || args.help) {
    logger.log(`
Usage:
  pinion [option] GENERATOR ACTION [--name NAME] [data-options]
  
Options:
  -h, --help # Show this message and quit
  --dry      # Perform a dry run.  Files will be generated but not saved.`)
    process.exit(0)
  }

  logger.log(args.dry ? '(dry mode)' : '')

  if (!generator) {
    throw new ShowHelpError('please specify a generator.')
  }

  if (!action) {
    throw new ShowHelpError(`please specify an action for ${generator}.`)
  }

  if (config.debug) {
    logger.log(`Loaded templates: ${templates.replace(`${cwd}/`, '')}`)
  }

  if (!fs.existsSync(actionfolder)) {
    throw new ShowHelpError(`I can't find action '${action}' for generator '${generator}'.
      You can try:
      1. 'pinion init self' to initialize your project, and
      2. 'pinion generator new --name ${generator}' to build the generator you wanted.
    `)
  }

  // lazy loading these dependencies gives a better feel once
  // a user is exploring pinion (not specifying what to execute)
  const render = (await import('./render')).default
  const rendered = await render(args, config)

  const { execute } = await import('./ops')
  const actions = await execute(rendered, args, config)

  const result: EngineResult = { args, actions, hookModule }
  const interactiveHook = hookModule as InteractiveHook

  if (interactiveHook && interactiveHook.rendered) {
    await interactiveHook.rendered(result, config)
  }

  return result
}

export default engine
