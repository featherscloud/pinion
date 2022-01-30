import { satisfies } from 'semver';
import { getPackageJSON } from './getPackageJSON';
import { getDependency } from './getDependency';
import type { Range } from 'semver';
import type { PackageJson } from 'type-fest';
import type { DependencyType } from '../types';

type HasDependencyOptions = {
  type?: DependencyType | 'any'
  cwd?: string
  packageJSON?: PackageJson
}

const defaultOptions: HasDependencyOptions = {
  type: 'dependency',
  cwd: process.cwd()
};

export const hasDependency = async (
  packages: Record<string, true | string | Range>,
  _options?: HasDependencyOptions
): Promise<Record<string, boolean>> => {
  const options = Object.assign({}, defaultOptions, _options);

  const packageJSON = options.packageJSON || await getPackageJSON();

  const result: Record<string, boolean> = {};

  for (const packageName in packages) {
    if (!Object.prototype.hasOwnProperty.call(packages, packageName)) {
      continue;
    }

    const condition = packages[packageName];

    const dependency = await getDependency(packageName, { packageJSON });

    if (!dependency) { result[packageName] = false; }
    else if (condition === true) { result[packageName] = true; }
    else {
      result[packageName] = satisfies(dependency, condition);
    }
  }

  return result;
};
