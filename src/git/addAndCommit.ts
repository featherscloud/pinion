import execa from 'execa';
import { hasProjectGit } from './hasProjectGit';

export const addAndCommit = async (
  message: string
): Promise<boolean> => {
  const cwd = process.cwd();

  if (!(await hasProjectGit(cwd))) return false;

  await execa('git', ['add', '*'], {
    cwd
  });

  await execa('git', ['commit', '-m', message.replace(/"/, '\\"')], {
    cwd
  });

  return true;
};
