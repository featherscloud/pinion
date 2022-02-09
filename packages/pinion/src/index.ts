import { Context } from './core'

export * from './core'
export * from './ops/index'
export * from './runner'

/**
 * Initialize a generator.
 *
 * @param initialContext
 * @returns
 */
export const generator = async <T> (initialContext: T): Promise<T & Context> => ({
  cwd: process.cwd(),
  ...initialContext
})
