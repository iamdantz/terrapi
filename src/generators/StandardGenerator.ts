import path from 'path';
import fs from 'fs-extra';
import { ITemplateGenerator } from '../core/ITemplateGenerator';
import { FileSystem } from '../utils/fileSystem';
import { Logger } from '../utils/logger';

export class StandardGenerator implements ITemplateGenerator {
  async generate(projectName: string, provider: string): Promise<void> {
    const spinner = Logger.spinner('Generating Standard project...').start();
    try {
      const projectPath = path.resolve(process.cwd(), projectName);
      const templatePath = path.resolve(__dirname, '../../templates/standard');

      await FileSystem.ensureDir(projectPath);

      // Copy all files first
      await FileSystem.copy(templatePath, projectPath);

      // Recursively find and render .ejs files
      const processDirectory = async (dir: string) => {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = await fs.stat(itemPath);
          if (stat.isDirectory()) {
            await processDirectory(itemPath);
          } else if (item.endsWith('.ejs')) {
            const destPath = itemPath.replace('.ejs', '');
            await FileSystem.renderTemplate(itemPath, destPath, { projectName, provider });
            await fs.remove(itemPath);
          }
        }
      };

      await processDirectory(projectPath);

      spinner.succeed('Standard project generated!');
    } catch (error: any) {
      spinner.fail(`Failed to generate standard project: ${error.message}`);
      throw error;
    }
  }
}
