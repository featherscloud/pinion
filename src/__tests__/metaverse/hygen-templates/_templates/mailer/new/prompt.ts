export default {
  async prompt({ prompter, args }: any): any {
    return prompter.prompt([
      {
        type: 'input',
        name: 'message',
        message: "What's your message?",
      },
    ])
  },
}
