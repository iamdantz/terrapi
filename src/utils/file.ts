import fs from 'fs-extra';
import { join, resolve, dirname, basename } from 'path';
import { render } from 'ejs';
import { logger } from './logger.js';

export class FileUtils {
  static async exists(path: string): Promise<boolean> {
    return await fs.pathExists(path);
  }

  static async ensureDirectory(path: string): Promise<void> {
    await fs.ensureDir(path);
  }

  static async readFile(filePath: string, encoding: string = 'utf-8'): Promise<string> {
    try {
      return await fs.readFile(filePath, { encoding: encoding as BufferEncoding });
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`);
      throw error;
    }
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      await this.ensureDirectory(dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`);
      throw error;
    }
  }

  static async copy(src: string, dest: string): Promise<void> {
    try {
      await fs.copy(src, dest);
    } catch (error) {
      logger.error(`Failed to copy from ${src} to ${dest}`);
      throw error;
    }
  }

  static async remove(path: string): Promise<void> {
    try {
      await fs.remove(path);
    } catch (error) {
      logger.error(`Failed to remove: ${path}`);
      throw error;
    }
  }

  static async listDirectory(path: string): Promise<string[]> {
    try {
      return await fs.readdir(path);
    } catch (error) {
      logger.error(`Failed to read directory: ${path}`);
      throw error;
    }
  }

  static async isDirectory(path: string): Promise<boolean> {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  static async renderTemplateToString(
    templatePath: string, 
    data: Record<string, unknown>
  ): Promise<string> {
    try {
      const templateContent = await this.readFile(templatePath);
      const renderedContent = render(templateContent, data);
      return renderedContent;
    } catch (error) {
      logger.error(`Failed to render template: ${templatePath}`);
      throw error;
    }
  }

  static async renderTemplate(
    templatePath: string, 
    outputPath: string, 
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const renderedContent = await this.renderTemplateToString(templatePath, data);
      await this.writeFile(outputPath, renderedContent);
    } catch (error) {
      logger.error(`Failed to render template: ${templatePath}`);
      throw error;
    }
  }

  static resolve(...paths: string[]): string {
    return resolve(...paths);
  }

  static join(...paths: string[]): string {
    return join(...paths);
  }

  static dirname(path: string): string {
    return dirname(path);
  }

  static basename(path: string, ext?: string): string {
    return basename(path, ext);
  }
}
