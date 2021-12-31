export function render(context: any) {
  const to = `given/pinion-js/new.md`
  const body = `
this demonstrates pinion loaded up .pinion.js and extended helpers.
${context.h.extended('hello')}
`

  return {
    body,
    to,
  }
}
