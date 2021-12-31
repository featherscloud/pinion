export function render(context: any) {
  const to = 'given/shell/hmm.txt'
  const body = `
this should be rendered into hmm.txt as usual.
but the shell action should create the file 'side-effect.hello' as well.
    `

  return {
    to,
    body,
    sh: `touch ${context.cwd}/given/shell/side-effect.hello`,
  }
}
