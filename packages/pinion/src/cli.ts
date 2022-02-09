import { runFolder } from './runner'

export const cli = (argv: string[]) => {
  const [, , ...args] = argv
  const [folder] = args

  runFolder(folder).then(() => console.log('Done'))
}
