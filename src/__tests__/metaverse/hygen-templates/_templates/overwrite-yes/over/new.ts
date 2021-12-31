export function render(context: any) {
  const to = `given/overwrite-no/new.md`
  const body = `always see this because it was overwritten`

  return {
    body,
    to,
  }
}
