export function render(context: any) {
  const to = `given/recursive-prompt/new.md`
  const body = `
This demonstrate recursive prompt.
The following should be the confirmation email typed
at the second prompt:

${context.emailConfirmation}
    `

  return {
    body,
    to,
  }
}
