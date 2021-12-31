export function render(context: any) {
  const to = `given/existing-params/new-params-alias.md`
  const body = `${context.email}`

  return {
    body,
    to,
  }
}
