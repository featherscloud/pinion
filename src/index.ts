import yargs from 'yargs-parser'

import { RunnerResult, RunnerConfig, RunnerArgs } from './types'
import resolve from './config-resolver'
import Logger from './logger'
import engine, { ShowHelpError } from './engine'

import { printHelp, availableActions, VERSION } from './help'

const getRunnerArgs = (argv: RunnerArgs | string[]): RunnerArgs => {
  if (Array.isArray(argv)) {
    const parsed = yargs(argv)
    const [generator, _action, name] = parsed._
    const { _, ...args } = parsed
    const [action, subaction] = _action.split(':')

    return {
      generator,
      action,
      subaction,
      name,
      args,
    }
  }

  const [action, subaction] = argv.action.split(':')

  return {
    action,
    subaction,
    ...argv,
  }
}

const runner = async (
  argv: RunnerArgs | string[],
  config: RunnerConfig,
): Promise<RunnerResult> => {
  const resolvedConfig = await resolve(config)
  const { templates, logger } = resolvedConfig
  try {
    const runnerArgs = getRunnerArgs(argv)
    const { actions } = await engine(runnerArgs, resolvedConfig)
    return { success: true, actions, time: 0 }
  } catch (err) {
    logger.log(err.toString())
    if (resolvedConfig.debug) {
      logger.log('details -----------')
      logger.log(err.stack)
      logger.log('-------------------')
    }
    if (err instanceof ShowHelpError) {
      printHelp(templates, logger)
    }
    return { success: false, actions: [], time: 0 }
  }
}

export * from './types'

export {
  runner,
  engine,
  resolve,
  printHelp,
  getRunnerArgs,
  availableActions,
  Logger,
  VERSION,
}
