export function render(context: any) {
  const to = `given/cli-prefill-prompt-vars/new.md`
  const body = `${context.messageFromCli}`

  return {
    body,
    to,
  }
}
