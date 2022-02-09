export type Context = {
  cwd: string
}

export type ContextCallable<T, C extends Context> = (ctx: C) => T|Promise<T>
export type Callable<T, C extends Context> = T|ContextCallable<T, C>

export const getCallable = async <T, C extends Context> (callable: Callable<T, C>, context: C) =>
  typeof callable === 'function' ? (callable as ContextCallable<T, C>)(context) : callable
