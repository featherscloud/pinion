export function render(context: any) {
  const to =
    context.notGiven?.length > 0 ? `given/conditional/shouldnt-be-there` : null
  const body = `
this should not render itself
because the 'notGiven' variable was never
given and 'to' results in null.    
`

  return {
    body,
    to,
  }
}
