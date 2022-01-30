import { resolve } from 'path';
import { readJSON } from '../json/readJSON';
import type { PackageJson } from 'type-fest';

export const getPackageJSON = async (
  cwd = process.cwd()
): Promise<PackageJson> => {
  const path = resolve(cwd, 'package.json');

  return await readJSON<PackageJson>(path);
};
