export interface ITemplateGenerator {
  generate(projectName: string, provider: string): Promise<void>;
}
