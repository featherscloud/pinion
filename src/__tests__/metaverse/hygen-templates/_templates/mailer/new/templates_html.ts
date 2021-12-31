export function render(context: any) {
  const to = `given/app/mailers/${context.message || 'unnamed'}/html.ejs`
  const body = `
This is the html email template.
Find me at <i>app/mailers/${context.message || 'unnamed'}/html.ejs</i>

<br />
<br />

You owe
${context.bill}
  `

  return {
    body,
    to,
  }
}
