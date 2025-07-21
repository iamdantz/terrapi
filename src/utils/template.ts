import { FileUtils } from './file.js';
import { TerraformProvider } from '../types/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class TemplateManager {
  private templatesPath: string;

  constructor() {
    this.templatesPath = join(__dirname, '../../templates');
  }

  async renderTemplate(templatePath: string, data: Record<string, unknown>): Promise<string> {
    const fullPath = join(this.templatesPath, templatePath);
    return await FileUtils.renderTemplateToString(fullPath, data);
  }

  async getTemplateContent(templatePath: string): Promise<string> {
    const fullPath = join(this.templatesPath, templatePath);
    return await FileUtils.readFile(fullPath);
  }

  async generateRootFiles(
    projectPath: string,
    provider: TerraformProvider,
    data: Record<string, unknown>
  ): Promise<void> {
    const basePath = `terraform/${provider}`;
    
    const versionsContent = await this.renderTemplate(
      `${basePath}/versions.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'versions.tf'), versionsContent);

    const providersContent = await this.renderTemplate(
      `${basePath}/providers.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'providers.tf'), providersContent);

    const backendContent = await this.renderTemplate(
      `${basePath}/backend.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'backend.tf'), backendContent);

    const mainTemplate = data.externalModules ? 'main-external.tf.ejs' : 'main-local.tf.ejs';
    const mainContent = await this.renderTemplate(
      `${basePath}/${mainTemplate}`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'main.tf'), mainContent);

    const variablesContent = await this.renderTemplate(
      `${basePath}/variables.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'variables.tf'), variablesContent);

    const outputsContent = await this.renderTemplate(
      `${basePath}/outputs.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(projectPath, 'outputs.tf'), outputsContent);
  }

  async generateConfigFiles(
    projectPath: string,
    provider: TerraformProvider,
    data: Record<string, unknown>
  ): Promise<void> {
    const configPath = join(projectPath, 'config');
    const environments = ['dev', 'staging', 'prod'];

    for (const env of environments) {
      const envData = { ...data, environment: env };
      const configContent = await this.renderTemplate(
        `terraform/${provider}/config.tfvars.ejs`,
        envData
      );
      await FileUtils.writeFile(join(configPath, `${env}.tfvars`), configContent);
    }
  }

  async generateModuleFiles(
    projectPath: string,
    provider: TerraformProvider,
    moduleName: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const modulePath = join(projectPath, 'modules', moduleName);
    const basePath = `terraform/modules/${provider}`;

    const mainContent = await this.renderTemplate(
      `${basePath}/${moduleName}-main.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(modulePath, 'main.tf'), mainContent);

    const variablesContent = await this.renderTemplate(
      `${basePath}/${moduleName}-variables.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(modulePath, 'variables.tf'), variablesContent);

    const outputsContent = await this.renderTemplate(
      `${basePath}/${moduleName}-outputs.tf.ejs`,
      data
    );
    await FileUtils.writeFile(join(modulePath, 'outputs.tf'), outputsContent);
  }

  async generateGitignore(projectPath: string): Promise<void> {
    const gitignoreContent = await this.getTemplateContent('terraform/.gitignore');
    await FileUtils.writeFile(join(projectPath, '.gitignore'), gitignoreContent);
  }

  getDefaultModuleName(provider: TerraformProvider): string {
    const moduleNames = {
      aws: 'vpc',
      azure: 'resource_group',
      gcp: 'vpc',
    };
    
    return moduleNames[provider];
  }
}
