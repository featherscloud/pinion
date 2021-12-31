export function render(context: any) {
  const to = `given/app/mailers/${context.message || 'unnamed'}/text.ejs`
  const body = `
This is the text email template.
Find me at [app/mailers/${context.message || 'unnamed'}/text.ejs]

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
