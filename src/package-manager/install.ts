import execa from 'execa';
import { getAgent, getCommand } from './agents';

const hasDevFlag = (args?: string | string[]): boolean => {
  if (!args) return false;
  const packages = (Array.isArray(args)) ? args : [args];
  const argsArr = packages.join(' ').split(' ');
  return argsArr.some(x => ['--dev', '-D'].includes(x));
};

const getArgsArr = (args?: string | string[]): undefined | string[] => {
  if (!args) { return; }
  const packages = (Array.isArray(args)) ? args : [args];
  const argsArr = packages.join(' ').split(' ');
  return argsArr;
};

export const install = async (
  packages?: string | string[],
  options?: { dev: boolean, global: boolean }
) => {
  const agent = await getAgent(options?.global);

  const args = getArgsArr(packages);

  let cmd: string;
  if (!args) {
    cmd = getCommand(agent, 'install');
  } else if (options?.global) {
    cmd = getCommand(agent, 'global');
  } else if (options?.dev) {
    if (!hasDevFlag(args)) { args.push('-D'); }
  }

  cmd = getCommand(agent, 'add');

  await execa.command(cmd, { stdio: 'inherit', encoding: 'utf-8', cwd: process.cwd() });
};
