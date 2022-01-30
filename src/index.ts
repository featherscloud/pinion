// git
export { addAndCommit } from './git/addAndCommit';
export { confirmIfGitDirty } from './git/confirmIfGitDirty';
export { gitReset } from './git/gitReset';
export { hasProjectGit } from './git/hasProjectGit';
export { isGitInstalled } from './git/isGitInstalled';
export { isWorkingTreeClean } from './git/isWorkingTreeClean';

// json
export { extendJSON } from './json/extendJSON';
export { readJSON } from './json/readJSON';
export { writeJSON } from './json/writeJSON';

// node
export { checkNodeVersion } from './node/checkNodeVersion';

// package-json
export { addScript } from './package-json/addScript';
export { extendPackageJSON } from './package-json/extendPackageJSON';
export { getDependency } from './package-json/getDependency';
export { getPackageJSON } from './package-json/getPackageJSON';
export { getScript } from './package-json/getScript';
export { hasDependency } from './package-json/hasDependency';
export { writePackageJSON } from './package-json/writePackageJSON';

// package manager
export { install } from './package-manager/install';
export { runScript } from './package-manager/runScript';
export { uninstall } from './package-manager/uninstall';

//

export * from './types';
