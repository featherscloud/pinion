const chalk = require('chalk')

const { yellow, red, green, magenta, template } = chalk

class Logger {
  log: (message?: any, ...optionalParams: any[]) => void

  constructor(log: (message?: any, ...optionalParams: any[]) => void) {
    this.log = log
  }

  colorful(msg: string): void {
    this.log(template(chalk, msg))
  }

  notice(msg: string): void {
    this.log(magenta(msg))
  }

  warn(msg: string): void {
    this.log(yellow(msg))
  }

  err(msg: string): void {
    this.log(red(msg))
  }

  ok(msg: string): void {
    this.log(green(msg))
  }
}

export default Logger
