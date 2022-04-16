import { existsSync } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'

let tsNode: any

const tsNodeRegister = async (mod = 'ts-node/register') => (tsNode = tsNode || import(mod))

const extensionCheck = /(\.ts|\.js)$/
const getFileName = (file: string) => {
  if (extensionCheck.test(file)) {
    return file
  }

  if (existsSync(`${file}.js`)) {
    return `${file}.js`
  }

  if (existsSync(`${file}.ts`)) {
    return `${file}.ts`
  }

  return file
}

export const loadModule = async (file: string) => {
  const fileName = getFileName(file)

  if (fileName.endsWith('.ts')) {
    await tsNodeRegister()
  }

  return import(file)
}

export const listFiles = async (folder: string, extension?: string): Promise<string[]> => {
  const list = await readdir(folder, { withFileTypes: true })
  const fileNames = (await Promise.all(list.map(file => {
    const fullName = path.resolve(folder, file.name)

    return file.isDirectory() ? listFiles(fullName, extension) : fullName
  }))).flat().sort()

  return extension ? fileNames.filter(name => name.endsWith(extension)) : fileNames
}

export const merge = (target: { [key: string]: any }, source: { [key: string]: any }) => {
  for (const key of Object.keys(source)) {
    const value = source[key]

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = merge(target[key] || {}, value)
    } else {
      target[key] = value
    }
  }

  return target
}
