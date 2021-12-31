export function render(context: any) {
  const to = `given/cli-prefill-prompt-vars/name-is-special.md`
  const body = `${context.name}`

  return {
    body,
    to,
  }
}
