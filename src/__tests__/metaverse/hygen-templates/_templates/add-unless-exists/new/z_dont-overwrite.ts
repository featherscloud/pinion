export function render(context: any) {
  const to = `given/add-unless-exists/${
    context.message || 'unnamed'
  }/always.txt`
  const body = `
This file should never be written
      `

  return {
    body,
    to,
    unlessExist: true,
  }
}
