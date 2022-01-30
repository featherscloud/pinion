import { resolve } from 'path';
import { writeJSON } from '../json/writeJSON';
import type { PackageJson } from 'type-fest';

export const writePackageJSON = async (
  pack: PackageJson,
  cwd = process.cwd()
): Promise<void> => {
  const path = resolve(cwd, 'package.json');
  return await writeJSON(path, pack);
};
