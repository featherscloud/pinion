import 'ts-node/register'
import { readdir } from 'fs/promises'
import path from 'path'

export const loadModule = async (file: string) => import(file)

export const listFiles = async (folder: string, extension?: string) => {
  const list = await readdir(folder)
  const fileNames = list.map(name => path.resolve(folder, name)).sort()

  return extension ? fileNames.filter(name => name.endsWith(extension)) : fileNames
}
