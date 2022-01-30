import merge from 'lodash/merge';
import { getPackageJSON } from './getPackageJSON';
import { writePackageJSON } from './writePackageJSON';
import type { PackageJson } from 'type-fest';

export const extendPackageJSON = async (
  extend: Partial<PackageJson>,
  cwd = process.cwd()
) => {
  const pack = await getPackageJSON(cwd);
  return await writePackageJSON(merge(pack, extend), cwd);
};
