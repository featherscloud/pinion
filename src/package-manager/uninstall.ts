import execa from 'execa';
import { getAgent, getCommand } from './agents';

const getArgsArr = (args?: string | string[]): undefined | string[] => {
  if (!args) { return; }
  const packages = (Array.isArray(args)) ? args : [args];
  const argsArr = packages.join(' ').split(' ');
  return argsArr;
};

export const uninstall = async (
  packages: string | string[],
  options?: { global: boolean }
) => {
  const agent = await getAgent(options?.global);

  const args = getArgsArr(packages);

  let cmd: string;
  if (!args) {
    cmd = getCommand(agent, 'uninstall');
  } else if (options?.global) {
    cmd = getCommand(agent, 'global_uninstall');
  }

  cmd = getCommand(agent, 'uninstall');

  await execa.command(cmd, { stdio: 'inherit', encoding: 'utf-8', cwd: process.cwd() });
};
