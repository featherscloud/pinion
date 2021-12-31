/** TODO: original:
 *
 * ---
 * to: given/app/mailers/<%= message || 'unnamed'%>/html.ejs
 * inject: true
 * before: !!js/regexp /You owe/g
 * skip_if: injected!
 * ---
 */

export function render(context: any) {
  const to = `given/app/mailers/${context.message || 'unnamed'}/html.ejs`
  const body = `
I was injected!!!
  `

  return {
    body,
    to,
    inject: true,
    before: '!!js/regexp /You owe/g',
    skipIf: !context.injected,
  }
}
