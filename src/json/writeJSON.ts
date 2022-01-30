import { writeJSON as _writeJSON } from 'fs-extra';

export const writeJSON = async <T extends Record<string, any>>(
  path: string,
  obj: T
): Promise<void> => {
  try {
    await _writeJSON(path, obj);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error has occurred ', error);
  }
};
