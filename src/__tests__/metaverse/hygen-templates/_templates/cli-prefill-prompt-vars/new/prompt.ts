export default {
  async prompt({ prompter, args }: any): any {
    return prompter.prompt([
      {
        type: 'input',
        name: 'message-from-cli',
        message: "What's your message?",
      },
    ])
  },
}
