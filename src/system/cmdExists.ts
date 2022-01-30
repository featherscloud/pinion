import os from 'os';
import { execSync } from 'child_process';

export const cmdExists = (
  cmd: string
): boolean => {
  try {
    execSync(
      os.platform() === 'win32'
        ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
        : `command -v ${cmd}`
    );
    return true;
  }
  catch {
    return false;
  }
};
