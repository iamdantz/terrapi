import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';

export class Logger {
  static info(message: string) {
    console.log(chalk.blue('ℹ '), message);
  }

  static success(message: string) {
    console.log(chalk.green('✔ '), message);
  }

  static error(message: string) {
    console.error(chalk.red('✖ '), message);
  }

  static warn(message: string) {
    console.warn(chalk.yellow('⚠ '), message);
  }

  static title(message: string) {
    console.log(
      boxen(chalk.cyan.bold(message), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      })
    );
  }

  static spinner(message: string) {
    return ora(message);
  }
}
