export function render(context: any) {
  const to = `given/positional-name/${context.name}/always.txt`
  const body = `this used a positional name`

  return {
    body,
    to,
  }
}
