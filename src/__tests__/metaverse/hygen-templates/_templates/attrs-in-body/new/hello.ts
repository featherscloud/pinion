export function render(context: any) {
  const to = `given/attrs-in-body/hello.txt`
  const body = `${context.attributes.to}`

  return {
    body,
    to,
  }
}
