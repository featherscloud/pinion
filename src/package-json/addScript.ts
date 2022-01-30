import { getPackageJSON } from './getPackageJSON';
import { writePackageJSON } from './writePackageJSON';

interface AddScriptsOption {
  cwd: string
}

export const addScript = async (
  scripts: Record<string, string>,
  _options?: AddScriptsOption
) => {
  const options = Object.assign({
    cwd: process.cwd()
  }, _options);

  const pack = await getPackageJSON(options.cwd);

  for (const scriptName in scripts) {
    if (Object.prototype.hasOwnProperty.call(scripts, scriptName)) {
      const script = scripts[scriptName];
      pack.scripts ||= {};
      pack.scripts[scriptName] = script;
    }
  }

  return await writePackageJSON(pack, options.cwd);
};
