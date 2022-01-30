import { readJSON as _readJSON } from 'fs-extra';

export const readJSON = async <T = any>(
  path: string
): Promise<T> => {
  return await _readJSON(path);
};
