import fs from 'fs';
import path from 'path';
import ini from 'ini';
import { findUp } from 'find-up';
import { LOCKS } from './agents';
import type { Agent} from './agents';

const customRcPath = process.env.NI_CONFIG_FILE;

const home = process.platform === 'win32'
  ? process.env.USERPROFILE
  : process.env.HOME;

const defaultRcPath = path.join(home || '~/', '.pinionrc');

const rcPath = customRcPath || defaultRcPath;

interface Config {
  defaultAgent: Agent | 'prompt'
  globalAgent: Agent
}

const defaultConfig: Config = {
  defaultAgent: 'prompt',
  globalAgent: 'npm'
};

export const getDefaultAgent = async () => {
  const { defaultAgent } = await getConfig();
  if (defaultAgent === 'prompt' && process.env.CI)
    return 'npm';
  return defaultAgent;
};

export const getGlobalAgent = async () => {
  const { globalAgent } = await getConfig();
  return globalAgent;
};

let config: Config | undefined;

export const getConfig = async (): Promise<Config> => {
  if (!config) {
    const result = await findUp('package.json') || '';
    let packageManager = '';
    if (result)
      packageManager = JSON.parse(fs.readFileSync(result, 'utf8')).packageManager ?? '';
    const [, agent] = packageManager.match(new RegExp(`^(${Object.values(LOCKS).join('|')})@.*?$`)) || [];
    if (agent)
      config = Object.assign({}, defaultConfig, { defaultAgent: agent });
    else if (!fs.existsSync(rcPath))
      config = defaultConfig;
    else
      config = Object.assign({}, defaultConfig, ini.parse(fs.readFileSync(rcPath, 'utf-8')));
  }
  return config;
};
