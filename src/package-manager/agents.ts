// https://github.com/antfu/ni/blob/main/src/agents.ts
import path from 'path';
import terminalLink from 'terminal-link';
import { findUp } from 'find-up';
import execa from 'execa';
import { prompt } from 'inquirer';
import { cmdExists } from '../system/cmdExists';
import { getDefaultAgent, getGlobalAgent } from './utils';

export interface DetectOptions {
    autoInstall?: boolean
    cwd?: string
  }

export const detect = async ({ autoInstall, cwd }: DetectOptions) => {
  const result = await findUp(Object.keys(LOCKS), { cwd: process.cwd() });
  const agent = (result ? LOCKS[path.basename(result)] : null);

  if (agent && !cmdExists(agent)) {
    if (!autoInstall) {
      // eslint-disable-next-line no-console
      console.warn(`Detected ${agent} but it doesn't seem to be installed.\n`);

      if (process.env.CI)
        process.exit(1);

      const link = terminalLink(agent, INSTALL_PAGE[agent]);
      const { tryInstall } = await prompt({
        name: 'tryInstall',
        type: 'confirm',
        message: `Would you like to globally install ${link}?`
      });
      if (!tryInstall)
        process.exit(1);
    }

    await execa.command(`npm i -g ${agent}`, { stdio: 'inherit', cwd });
  }

  return agent;
};


const npmRun = (agent: string) => (args: string[]) => {
  if (args.length > 1)
    return `${agent} run ${args[0]} -- ${args.slice(1).join(' ')}`;
  else return `${agent} run ${args[0]}`;
};

const appendArgs = (cmd: string) => (args: string[]) => {
  return `${cmd} ${args.join(' ')}`;
};

export const AGENTS = {
  npm: {
    'run': npmRun('npm'),
    'install': 'npm i',
    'frozen': 'npm ci',
    'global': appendArgs('npm i -g'),
    'add': appendArgs('npm i'),
    'upgrade': appendArgs('npm update'),
    'upgrade-interactive': null,
    'execute': appendArgs('npx'),
    'uninstall': appendArgs('npm uninstall'),
    'global_uninstall': appendArgs('npm uninstall -g')
  },
  yarn: {
    'run': appendArgs('yarn run'),
    'install': 'yarn install',
    'frozen': 'yarn install --frozen-lockfile',
    'global': appendArgs('yarn global add'),
    'add': appendArgs('yarn add'),
    'upgrade': appendArgs('yarn upgrade'),
    'upgrade-interactive': appendArgs('yarn upgrade-interactive'),
    'execute': appendArgs('yarn dlx'),
    'uninstall': appendArgs('yarn remove'),
    'global_uninstall': appendArgs('yarn global remove')
  },
  pnpm: {
    'run': npmRun('pnpm'),
    'install': 'pnpm i',
    'frozen': 'pnpm i --frozen-lockfile',
    'global': appendArgs('pnpm i -g'),
    'add': appendArgs('pnpm i'),
    'upgrade': appendArgs('pnpm update'),
    'upgrade-interactive': appendArgs('pnpm update -i'),
    'execute': appendArgs('pnpm dlx'),
    'uninstall': appendArgs('pnpm remove'),
    'global_uninstall': appendArgs('pnpm remove -g')
  }
};

export type Agent = keyof typeof AGENTS
export type Command = keyof typeof AGENTS.npm

export const agents = Object.keys(AGENTS) as Agent[];

export const LOCKS: Record<string, Agent> = {
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm'
};

export const INSTALL_PAGE: Record<Agent, string> = {
  pnpm: 'https://pnpm.js.org/en/installation',
  yarn: 'https://yarnpkg.com/getting-started/install',
  npm: 'https://www.npmjs.com/get-npm'
};

export const getCommand = (
  agent: Agent,
  command: Command,
  args: string[] = []
) => {
if (!(agent in AGENTS)) {
  throw new Error(`Unsupported agent "${agent}"`);
}

const c = AGENTS[agent][command];

if (typeof c === 'function')
  return c(args);

if (!c)
  throw new Error(`Command "${command}" is not support by agent "${agent}"`);
};

export const getAgent = async (isGlobal?: boolean): Promise<Agent> => {
  let agent = (isGlobal)
    ? await getGlobalAgent()
    : await detect({ autoInstall: true }) || await getDefaultAgent();

  if (agent !== 'prompt') { return agent; }

  agent = (await prompt({
    name: 'agent',
    type: 'list',
    message: 'Choose the agent',
    choices: agents.map(value => ({ title: value, value }))
  })).agent;

  if (!agent) {
    throw new Error('No agent defined');
  }
};
