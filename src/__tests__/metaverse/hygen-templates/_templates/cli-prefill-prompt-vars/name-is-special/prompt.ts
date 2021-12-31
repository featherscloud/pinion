export default {
  async prompt({ prompter, args }: any): any {
    return prompter.prompt([
      {
        type: 'input',
        name: 'name',
        message: "What's your message?",
      },
    ])
  },
}
