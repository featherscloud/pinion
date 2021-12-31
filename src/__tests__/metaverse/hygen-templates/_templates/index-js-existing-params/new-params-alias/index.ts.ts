export function render(context: any) {
  const to = `given/index-js-existing-params/new-params-alias.md`
  const body = `${context.email}`

  return {
    body,
    to,
  }
}
