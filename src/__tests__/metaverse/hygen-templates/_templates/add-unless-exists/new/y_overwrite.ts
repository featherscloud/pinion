export function render(context: any) {
  const to = `given/add-unless-exists/${
    context.message || 'unnamed'
  }/always.txt`
  const body = `
This file should overwrite the other
      `

  return {
    body,
    to,
  }
}
