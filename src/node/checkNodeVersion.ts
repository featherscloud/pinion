import chalk from 'chalk';
import semver from 'semver';
import type { Range } from 'semver';

export const checkNodeVersion = (
  wanted: string | Range,
  name: string
) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    // eslint-disable-next-line no-console
    console.log(chalk.red(
      `You are using Node ${process.version}, but this version of ${name} requires Node ${wanted.toString()}.\nPlease upgrade your Node version.`
    ));
    process.exit(1);
  }
};
