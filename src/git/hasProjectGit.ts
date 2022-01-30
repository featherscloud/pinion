import execa from 'execa';

export const hasProjectGit = async (
  cwd: string = process.cwd()
): Promise<boolean> => {
  try {
    await execa('git', ['status'], { stdio: 'ignore', cwd });
    return true;
  } catch (e) {
    return false;
  }
};
