export default {
  async prompt({ prompter, args }: any): any {
    return prompter
      .prompt({
        type: 'input',
        name: 'email',
        message: "What's your email?",
      })
      .then(({ email }) =>
        prompter.prompt({
          type: 'input',
          name: 'emailConfirmation',
          message: `Please type your email [${email}] again:`,
        }),
      )
  },
}
