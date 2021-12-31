export function render(context: any) {
  const to = `given/app/mailers/${context.name || 'unnamed-mailer'}.js`
  const name = context.name || 'unnamed'
  const Name = context.h.capitalize(name)
  const message = context.message || 'unnamed'
  const Message = context.h.capitalize(message)
  const body = `
const { Mailer } = require('hyperwork')

class ${Name} extends Mailer {
 static defaults = {
   from: 'acme <acme@acme.org>'
 }

 static send${Message}(user) {
   // https://nodemailer.com/message/
   this.mail({
     to: user.email,
     template: '${message}',
     locals: {
       bill: '$13'
     }
   })
 }
}

module.exports = ${Name}
`

  return {
    body,
    to,
  }
}
