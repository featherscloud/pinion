export function render(context: any) {
  const to = `given/app/workers/${context.name || 'unnamed-worker'}.js`
  const name = context.name || 'unnamed'
  const Name = context.h.capitalize(name)
  const body = `
const { Worker } = require('hyperwork')
const asyncwork = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
  })
}

class ${Name} extends Worker {
  async perform({ data }) {
    this.log('started work')
    await asyncwork()
    this.log('finished work')
  }
}

module.exports = ${Name}
`

  return {
    body,
    to,
  }
}
