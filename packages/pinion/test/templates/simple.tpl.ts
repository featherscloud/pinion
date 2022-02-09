import { generator, render, to, prompt, Context } from '../../src'

type Variables = { name: string, description: string } & Context

const template = ({ name, description }: Variables) =>
`## ${name}

${description}

Copyright (c) ${new Date().getFullYear()} Feathers
`

export default async (ctx: Variables) => generator(ctx)
  .then(prompt([{
    type: 'input',
    name: 'name',
    message: 'What is the name of your project?'
  }, {
    type: 'input',
    name: 'description',
    message: 'Write a short description'
  }]))
  .then(render(template, to('readme.md')))
