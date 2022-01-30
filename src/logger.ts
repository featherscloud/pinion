import chalk from 'chalk';

export class Logger {
  log: (message?: any, ...optionalParams: any[]) => void;

  constructor (log: (message?: any, ...optionalParams: any[]) => void) {
    this.log = log;
  }

  colorful (msg: string) {
    this.log(chalk`${msg}`);
  }

  notice (msg: string) {
    this.log(chalk.magenta(msg));
  }

  warn (msg: string) {
    this.log(chalk.yellow(msg));
  }

  err (msg: string) {
    this.log(chalk.red(msg));
  }

  ok (msg: string) {
    this.log(chalk.green(msg));
  }
}
