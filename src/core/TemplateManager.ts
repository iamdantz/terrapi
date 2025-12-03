import { ITemplateGenerator } from './ITemplateGenerator';
import { Logger } from '../utils/logger';

export class TemplateManager {
  private generator: ITemplateGenerator;

  constructor(generator: ITemplateGenerator) {
    this.generator = generator;
  }

  async execute(projectName: string, provider: string) {
    try {
      Logger.info(`Starting generation for project: ${projectName}`);
      await this.generator.generate(projectName, provider);
      Logger.success('Project generation completed successfully!');
    } catch (error: any) {
      Logger.error(`Generation failed: ${error.message}`);
      process.exit(1);
    }
  }
}
