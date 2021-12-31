export function render(context: any) {
  const to = `given/cli-prefill-prompt-vars/falsy.md`
  const body = `${context.includeSomething}`

  return {
    body,
    to,
  }
}
