import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { LogLevel, SpinnerOptions } from '../types/index.js';

export class Logger {
  private static instance: Logger;
  private verbose: boolean = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  debug(message: string): void {
    if (this.verbose) {
      console.log(chalk.gray('🐛'), chalk.gray(message));
    }
  }

  log(level: LogLevel, message: string): void {
    switch (level) {
      case 'info':
        this.info(message);
        break;
      case 'success':
        this.success(message);
        break;
      case 'warn':
        this.warn(message);
        break;
      case 'error':
        this.error(message);
        break;
      case 'debug':
        this.debug(message);
        break;
    }
  }
}

export class Spinner {
  private spinner: Ora;

  constructor(options: SpinnerOptions) {
    this.spinner = ora({
      text: options.text,
      color: options.color || 'cyan',
    });
  }

  start(): this {
    this.spinner.start();
    return this;
  }

  stop(): this {
    this.spinner.stop();
    return this;
  }

  succeed(text?: string): this {
    this.spinner.succeed(text);
    return this;
  }

  fail(text?: string): this {
    this.spinner.fail(text);
    return this;
  }

  warn(text?: string): this {
    this.spinner.warn(text);
    return this;
  }

  info(text?: string): this {
    this.spinner.info(text);
    return this;
  }

  setText(text: string): this {
    this.spinner.text = text;
    return this;
  }
}

export const logger = Logger.getInstance();
