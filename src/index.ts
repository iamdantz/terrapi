#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';

const program = new Command();

program.name('terrapi').description('A CLI tool to scaffold Terraform projects').version('1.0.0');

program.command('init').description('Initialize a new Terraform project').action(initCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
