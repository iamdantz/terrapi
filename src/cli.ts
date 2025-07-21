#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initCommand } from './commands/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const notifier = updateNotifier({
  pkg: packageJson,
  updateCheckInterval: 1000 * 60 * 60 * 24,
});

if (notifier.update) {
  console.log(
    chalk.yellow(
      `Update available: ${notifier.update.current} → ${notifier.update.latest}\n` +
      `Run ${chalk.cyan(`npm i -g ${packageJson.name}`)} to update`
    )
  );
}

const cli = yargs(hideBin(process.argv))
  .scriptName('terrapi')
  .usage(chalk.blue('$0 <command> [options]'))
  .version(packageJson.version)
  .alias('v', 'version')
  .alias('h', 'help')
  .command(initCommand)
  .demandCommand(1, chalk.red('You must specify a command'))
  .help()
  .wrap(Math.min(120, process.stdout.columns || 80))
  .epilogue(
    chalk.gray(
      `Terrapi - Terraform Project Generator\n` +
      `For more information, visit: ${chalk.underline('https://github.com/iamdantz/terrapi')}`
    )
  );

process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('Unhandled Rejection:'), reason);
  process.exit(1);
});

cli.parse();
