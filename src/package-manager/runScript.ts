import execa from 'execa';
import { getAgent, getCommand } from './agents';

const getArgsArr = (...args: string[]): undefined | string[] => {
  if (!args) { return; }
  args = args.filter(x => !!x);
  if (!args.length) { return; }
  const packages = (Array.isArray(args)) ? args : [args];
  const argsArr = packages.join(' ').split(' ');
  return argsArr;
};

export const runScript = async (
  script: string,
  args?: string[],
  options?: { dev: boolean, global: boolean }
) => {
  const agent = await getAgent(options?.global);

  let scriptWithArgs = [script];
  if (args) scriptWithArgs = [...scriptWithArgs, ...args];

  const allArgs = getArgsArr(...scriptWithArgs);

  const cmd = getCommand(agent, 'run', allArgs);

  await execa.command(cmd, { stdio: 'inherit', encoding: 'utf-8', cwd: process.cwd() });
};
