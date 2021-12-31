export function render(context: any) {
  const to = `given/app/mailers/${context.message || 'unnamed'}/subject.ejs`
  const body = `
subject! find me at [app/mailers/${context.message || 'unnamed'}/subject.ejs]
    `

  return {
    body,
    to,
  }
}
