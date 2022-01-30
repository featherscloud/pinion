import execa from 'execa';

export const isGitInstalled = async (
): Promise<boolean> => {
  if (process.env.VUE_CLI_TEST) {
    return true;
  }
  try {
    await execa('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};
