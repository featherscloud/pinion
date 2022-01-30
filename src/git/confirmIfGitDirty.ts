import { prompt } from 'inquirer';
import { hasProjectGit } from './hasProjectGit';
import { isWorkingTreeClean } from './isWorkingTreeClean';

export const confirmIfGitDirty = async (
  cwd: string = process.cwd()
): Promise<boolean> => {
  if (!(await hasProjectGit(cwd))) {
    return true;
  }

  const isClean = await isWorkingTreeClean(cwd);
  if (isClean) { return true; }

  // eslint-disable-next-line no-console
  console.warn('There are uncommitted changes in the current repository, it\'s recommended to commit or stash them first.');
  const { ok } = await prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: 'Still proceed?',
      default: false
    }
  ]);
  return ok;
};
