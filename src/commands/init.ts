import { CommandModule, Argv } from 'yargs';
import inquirer from 'inquirer';
import { execa } from 'execa';
import chalk from 'chalk';
import { logger, Spinner, FileUtils, TemplateManager } from '../utils/index.js';
import { InitOptions, TerraformProvider, TerraformProject } from '../types/index.js';
import path from 'path';

interface InitArgs extends InitOptions {
  name?: string;
  provider?: TerraformProvider;
  'external-modules'?: boolean;
  'git-init'?: boolean;
  externalModules?: boolean;
  gitInit?: boolean;
  path?: string;
}

export const initCommand: CommandModule<{}, InitArgs> = {
  command: 'init [name]',
  describe: 'Initialize a new Terraform project',
  builder: (yargs: Argv) => {
    return yargs
      .positional('name', {
        describe: 'Project name or path',
        type: 'string',
      })
      .option('provider', {
        alias: 'p',
        describe: 'Cloud provider',
        type: 'string',
        choices: ['aws', 'azure', 'gcp'] as const,
      })
      .option('external-modules', {
        describe: 'Use external modules instead of local modules',
        type: 'boolean',
      })
      .option('git-init', {
        describe: 'Initialize a new git repository',
        type: 'boolean',
      })
      .option('force', {
        alias: 'f',
        describe: 'Force overwrite existing directory',
        type: 'boolean',
        default: false,
      })
      .option('verbose', {
        alias: 'v',
        describe: 'Enable verbose logging',
        type: 'boolean',
        default: false,
      }) as Argv<InitArgs>;
  },
  handler: async (argv: InitArgs) => {
    logger.setVerbose(argv.verbose || false);
    logger.empty();
    logger.label('terrapi', 'Launch sequence initiated.', 'green');
    logger.empty();
    
    try {
      const options = await promptForMissingOptions(argv);
      await executeInit(options);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Initialization failed: ${error.message}`);
      } else {
        logger.error('Initialization failed with unknown error');
      }
      process.exit(1);
    }
  },
};

async function promptForMissingOptions(options: InitArgs): Promise<TerraformProject> {
  const questions: Array<any> = [];

  logger.debug(`Received options: ${JSON.stringify(options, null, 2)}`);

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What is your project name or path?',
      default: 'terraform-project',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name is required';
        }
        return true;
      },
      prefix: chalk.bgCyan.black(' dir '),
    });
  }

  if (!options.provider) {
    questions.push({
      type: 'list',
      name: 'provider',
      message: 'Which cloud provider will you use?',
      choices: [
        { name: '🟠 AWS (Amazon Web Services)', value: 'aws' },
        { name: '🔵 Azure (Microsoft Azure)', value: 'azure' },
        { name: '🟡 GCP (Google Cloud Platform)', value: 'gcp' },
      ],
      default: 'aws',
      prefix: chalk.bgMagenta.black(' cloud '),
    });
  }

  if (options.externalModules === undefined) {
    questions.push({
      type: 'confirm',
      name: 'externalModules',
      message: 'Will you use external modules (instead of local modules)?',
      default: false,
      prefix: chalk.bgYellow.black(' modules '),
    });
  }

  if (options.gitInit === undefined) {
    questions.push({
      type: 'confirm',
      name: 'gitInit',
      message: 'Initialize a new git repository?',
      default: true,
      prefix: chalk.bgGreen.black(' git '),
    });
  }

  const answers = await inquirer.prompt(questions);
  
  const projectName = options.name || answers.name;
  const isPath = projectName.includes('/') || projectName.includes('\\');
  
  return {
    name: isPath ? path.basename(projectName) : projectName,
    provider: (options.provider || answers.provider) as TerraformProvider,
    externalModules: options.externalModules ?? answers.externalModules ?? false,
    gitInit: options.gitInit ?? answers.gitInit ?? true,
    projectPath: isPath ? path.resolve(projectName) : path.resolve(process.cwd(), projectName),
  };
}

async function executeInit(project: TerraformProject): Promise<void> {
  logger.debug(`Project name: ${project.name}`);
  logger.debug(`Project path: ${project.projectPath}`);
  logger.debug(`Provider: ${project.provider}`);
  logger.debug(`External modules: ${project.externalModules}`);
  logger.debug(`Git init: ${project.gitInit}`);

  if (await FileUtils.exists(project.projectPath)) {
    logger.error(`Directory already exists: ${project.projectPath}`);
    logger.info('Use --force to overwrite existing directory');
    process.exit(1);
  }

  const structureSpinner = new Spinner({ text: 'Creating project structure...' });
  structureSpinner.start();
  
  try {
    await createProjectStructure(project);
    structureSpinner.succeed('Project structure created');
  } catch (error) {
    structureSpinner.fail('Failed to create project structure');
    throw error;
  }

  const filesSpinner = new Spinner({ text: 'Generating Terraform files...' });
  filesSpinner.start();
  
  try {
    await generateTerraformFiles(project);
    filesSpinner.succeed('Terraform files generated');
  } catch (error) {
    filesSpinner.fail('Failed to generate Terraform files');
    throw error;
  }

  if (project.gitInit) {
    const gitSpinner = new Spinner({ text: 'Initializing git repository...' });
    gitSpinner.start();
    
    try {
      await execa('git', ['init'], { cwd: project.projectPath });
      await createGitignore(project.projectPath);
      gitSpinner.succeed('Git repository initialized');
    } catch (error) {
      gitSpinner.fail('Failed to initialize git repository');
      logger.warn('You can initialize git manually by running: git init');
    }
  }

  logger.empty();
  logger.success(`Project initialized!`);
  logger.empty();

  logger.plain(`  ${chalk.dim('■')} Template copied`);
  logger.plain(`  ${chalk.dim('■')} Terraform files generated`);
  if (project.gitInit) {
    logger.plain(`  ${chalk.dim('■')} Git repository initialized`);
  }
  logger.empty();

  logger.label('next', `Explore your project!`, 'cyan');
  logger.empty();
  
  const projectDir = path.relative(process.cwd(), project.projectPath);
  logger.nextStep(`cd ${projectDir}`, 'Enter your project directory');
  logger.nextStep('terraform init', 'Initialize Terraform providers and modules');
  logger.nextStep('terraform plan', 'Preview infrastructure changes');
  logger.empty();
  
  logger.plain(chalk.dim(`Stuck? Configure your ${project.provider.toUpperCase()} credentials first.`));
}

async function createProjectStructure(project: TerraformProject): Promise<void> {
  await FileUtils.ensureDirectory(project.projectPath);
  await FileUtils.ensureDirectory(FileUtils.join(project.projectPath, 'config'));
  
  if (!project.externalModules) {
    await FileUtils.ensureDirectory(FileUtils.join(project.projectPath, 'modules'));

    const templateManager = new TemplateManager();
    const moduleName = templateManager.getDefaultModuleName(project.provider);
    const modulePath = FileUtils.join(project.projectPath, 'modules', moduleName);
    await FileUtils.ensureDirectory(modulePath);
  }
}

async function generateTerraformFiles(project: TerraformProject): Promise<void> {
  const templateManager = new TemplateManager();
  const templateData = {
    projectName: project.name,
    provider: project.provider,
    externalModules: project.externalModules,
  };

  await templateManager.generateRootFiles(project.projectPath, project.provider, templateData);
  
  await templateManager.generateConfigFiles(project.projectPath, project.provider, templateData);

  if (!project.externalModules) {
    const moduleName = templateManager.getDefaultModuleName(project.provider);
    await generateModuleFiles(project, templateManager, moduleName, templateData);
  }
}

async function generateModuleFiles(
  project: TerraformProject,
  templateManager: TemplateManager,
  moduleName: string,
  templateData: Record<string, unknown>
): Promise<void> {
  await templateManager.generateModuleFiles(
    project.projectPath,
    project.provider,
    moduleName,
    templateData
  );
}

async function createGitignore(projectPath: string): Promise<void> {
  const templateManager = new TemplateManager();
  await templateManager.generateGitignore(projectPath);
}
