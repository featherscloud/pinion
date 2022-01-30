import { getPackageJSON } from './getPackageJSON';

export const getScript = async (
  sriptName: string
): Promise<string | undefined> => {
  const pack = await getPackageJSON();
  return pack.scripts[sriptName];
};
