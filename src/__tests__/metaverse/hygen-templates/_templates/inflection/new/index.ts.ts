export function render(context: any) {
  const to = `given/my_app/${context.h.inflection.pluralize(context.name)}.md`
  const body = `hello people!`

  return {
    body,
    to,
  }
}
