export function render(context: any) {
  const to = `given/existing-params/new.md`
  const body = `${context.email}`

  return {
    body,
    to,
  }
}
