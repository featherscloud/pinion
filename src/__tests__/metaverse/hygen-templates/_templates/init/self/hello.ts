export function render(context: any) {
  const to = `given/_templates/sample/new/hello.ejs.t`
  const body = `
---
to: my_app/template.md
---

hello metaverse!
This is your first pinion template.

Learn what it can do here:

https://github.com/feathersjs/pinion
`

  return {
    body,
    to,
  }
}
