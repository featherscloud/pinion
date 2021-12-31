export default {
  async prompt({ prompter, args }: any): any {
    return prompter.prompt([
      {
        type: 'input',
        name: 'includeSomething',
        message: "What's your message?",
      },
    ])
  },
}
