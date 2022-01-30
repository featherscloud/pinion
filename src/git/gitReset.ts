import execa from 'execa';
import { hasProjectGit } from './hasProjectGit';

export const gitReset = async (
): Promise<boolean> => {
  const cwd = process.cwd();
  if (!hasProjectGit(cwd)) return false;

  await execa('git', ['reset'], {
    cwd
  });

  return true;
};
