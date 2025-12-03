import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { Logger } from './logger';

export class FileSystem {
  static async copy(src: string, dest: string) {
    try {
      await fs.copy(src, dest);
    } catch (error: any) {
      Logger.error(`Failed to copy ${src} to ${dest}: ${error.message}`);
      throw error;
    }
  }

  static async renderTemplate(
    templatePath: string,
    destPath: string,
    data: any
  ) {
    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const content = ejs.render(template, data);
      await fs.outputFile(destPath, content);
    } catch (error: any) {
      Logger.error(`Failed to render template ${templatePath}: ${error.message}`);
      throw error;
    }
  }

  static async ensureDir(dirPath: string) {
    await fs.ensureDir(dirPath);
  }
  
  static async pathExists(pathToCheck: string): Promise<boolean> {
      return await fs.pathExists(pathToCheck);
  }
}
