export function render(context: any) {
  const body = `hello, this was piped`

  return {
    body,
    sh: `mkdir -p ${context.cwd}/given/shell && cat > ${context.cwd}/given/shell/hello.piped`,
  }
}
