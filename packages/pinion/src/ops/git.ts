import { PinionContext } from '../core'
import { addTrace } from './helpers'
import { utilExec } from './process'

/**
 * Utility to check if the current project has a git repository
 * @param ctx The current context
 * @returns If the current project has a git repository
 */
export const utilGitHasProjectGit = async <C extends PinionContext>(ctx: C) => {
  try {
    await utilExec('git', 'status', { stdio: 'ignore', cwd: ctx.cwd })(ctx)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Utility to check if the current git working tree is clean
 * @param ctx The current context
 * @returns If the current git working tree is clean
 */
export const utilGitIsWorkingTreeClean = async <C extends PinionContext>(ctx: C) => {
  try {
    const { stdout: status } = await utilExec('git', ['status', '--porcelain'], { cwd: ctx.cwd })(ctx)
    if (status !== '') {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Check if the current project has a git repository and the working tree is clean
 * Show a warning message and a prompt which the user needs to confirm to continue
 *
 * @returns The current context
 */
export const confirmGitIsWorkingTreeClean =
  <C extends PinionContext>() =>
    async <T extends C>(ctx: T) => {
      if (process.env.PINION_SKIP_GIT_WORKING_TREE_PROMPT) {
        return true
      }

      if (!(await utilGitHasProjectGit(ctx))) {
        process.env.PINION_SKIP_GIT_WORKING_TREE_PROMPT = 'true'
        return addTrace(ctx, 'confirmIsWorkingTreeClean', { hasGit: false })
      }

      const isClean = await utilGitIsWorkingTreeClean(ctx)

      if (isClean) {
        process.env.PINION_SKIP_GIT_WORKING_TREE_PROMPT = 'true'
        return addTrace(ctx, 'confirmIsWorkingTreeClean', { isClean })
      }

      ctx.pinion.logger.warn(
        "There are uncommitted changes in the current repository, it's recommended to commit or stash them first."
      )

      const { ok } = await ctx.pinion.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: 'Still proceed?',
          default: false
        }
      ])

      if (ok) {
        ctx.pinion.logger.notice('Proceeding anyway')
        process.env.PINION_SKIP_GIT_WORKING_TREE_PROMPT = 'true'
        return addTrace(ctx, 'confirmIsWorkingTreeClean', { isClean })
      } else {
        throw new Error('Operation aborted')
      }
    }
