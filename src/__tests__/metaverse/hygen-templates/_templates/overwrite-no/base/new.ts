export function render(context: any) {
  const to = `given/overwrite-no/new.md`
  const body = `always see this because it wasnt overwritten`

  return {
    body,
    to,
  }
}
