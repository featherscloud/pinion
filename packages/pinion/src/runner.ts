import 'ts-node/register'
import { listFiles } from './fs'

export const loadModule = async (file: string) => (await import(file)).default

export const runFolder = async (folder: string) => {
  const templates = await listFiles(folder, '.tpl.ts')

  await Promise.all(templates.map(async module => {
    const runner = await loadModule(module)

    await runner({})
  }))
}
