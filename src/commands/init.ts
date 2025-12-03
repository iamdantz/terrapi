import { input, select } from '@inquirer/prompts';
import { TemplateManager } from '../core/TemplateManager';
import { StandardGenerator } from '../generators/StandardGenerator';
import { TerragruntGenerator } from '../generators/TerragruntGenerator';
import { Logger } from '../utils/logger';
import chalk from 'chalk';
import boxen from 'boxen';

export async function initCommand() {
  console.clear();
  
  console.log(
    boxen(chalk.cyan.bold('Terrapi CLI') + '\n' + chalk.dim('Infrastructure as Code Scaffolding'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      textAlignment: 'center'
    })
  );

  Logger.info(chalk.bold('Welcome! Let\'s set up your new Terraform project.\n'));

  const projectName = await input({
    message: 'Project Name:',
    default: 'my-terraform-project',
    validate: (value) => value.trim().length > 0 || 'Project name cannot be empty',
  });

  const provider = await select({
    message: 'Cloud Provider:',
    choices: [
      { name: 'AWS', value: 'AWS' },
      { name: 'Azure', value: 'Azure' },
      { name: 'Google Cloud Platform (GCP)', value: 'GCP' },
      { name: 'Other', value: 'Other' },
    ],
  });

  const template = await select({
    message: 'Architecture Template:',
    choices: [
      {
        name: 'Standard',
        value: 'standard',
        description: 'Modules + Environment Wrappers. Best for most projects.',
      },
      {
        name: 'Terragrunt',
        value: 'terragrunt',
        description: 'DRY + Auto-Backend. Best for large scale/multi-team.',
      },
    ],
  });

  let generator;

  if (template === 'standard') {
    generator = new StandardGenerator();
  } else {
    generator = new TerragruntGenerator();
  }

  const manager = new TemplateManager(generator);
  await manager.execute(projectName, provider);

  const nextSteps = [];
  nextSteps.push(chalk.bold('To get started:'));
  nextSteps.push('');
  nextSteps.push(`  ${chalk.cyan('cd')} ${projectName}`);
  
  if (template === 'standard') {
    nextSteps.push(`  ${chalk.cyan('cd')} environments/dev`);
    nextSteps.push(`  ${chalk.cyan('terraform')} init`);
    nextSteps.push(`  ${chalk.cyan('terraform')} plan`);
  } else {
    nextSteps.push(`  ${chalk.cyan('cd')} environments/dev/example`);
    nextSteps.push(`  ${chalk.cyan('terragrunt')} init`);
    nextSteps.push(`  ${chalk.cyan('terragrunt')} plan`);
  }

  console.log(
    boxen(nextSteps.join('\n'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      title: 'Next Steps',
      titleAlignment: 'center'
    })
  );
}
