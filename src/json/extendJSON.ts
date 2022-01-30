import merge from 'lodash/merge';
import { readJSON } from './readJSON';
import { writeJSON } from './writeJSON';

export const extendJSON = async <T extends Record<string, any>>(
  extend: T,
  path: string
  ) => {
  const obj = await readJSON(path);
  return await writeJSON(path, merge(obj, extend));
};
