import { getPackageJSON } from './getPackageJSON';
import type { PackageJson } from 'type-fest';
import type { DependencyType } from '../types';

type GetDependencyOptions = {
  type?: DependencyType | 'any'
  cwd?: string
  packageJSON?: PackageJson
}

const defaultOptions: GetDependencyOptions = {
  type: 'dependency',
  cwd: process.cwd()
};

export const getDependency = async (
  packageName: string,
  _options?: Partial<GetDependencyOptions>
): Promise<string | undefined> => {
  const options = Object.assign({}, defaultOptions, _options);

  const pack = options.packageJSON || await getPackageJSON(options.cwd);

  if (options.type !== 'any') {
    return pack[options.type][packageName];
  } else {
    for (const type of ['dependency', 'devDependency', 'peerDependency']) {
      const dep = pack[type][packageName];
      if (dep) { return dep; }
    }
  }
  return undefined;
};
