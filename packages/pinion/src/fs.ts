import { readdir } from 'fs/promises'
import path from 'path'

export const listFiles = async (folder: string, extension?: string) => {
  const list = await readdir(folder)
  const fileNames = list.map(name => path.resolve(folder, name))

  return extension ? fileNames.filter(name => name.endsWith(extension)) : fileNames
}
