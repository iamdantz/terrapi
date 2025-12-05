import { TerragruntGenerator } from './TerragruntGenerator';
import { FileSystem } from '../utils/fileSystem';
import fs from 'fs-extra';

jest.mock('../utils/fileSystem');
jest.mock('fs-extra');
jest.mock('../utils/logger', () => ({
  Logger: {
    spinner: () => ({
      start: () => ({
        succeed: jest.fn(),
        fail: jest.fn(),
      }),
    }),
  },
}));

describe('TerragruntGenerator', () => {
  const generator = new TerragruntGenerator();
  const projectName = 'test-project';
  const provider = 'AWS';

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readdir as unknown as jest.Mock).mockResolvedValue([]);
    (fs.stat as unknown as jest.Mock).mockResolvedValue({ isDirectory: () => false });
  });

  it('should generate a Terragrunt project', async () => {
    await generator.generate(projectName, provider);

    expect(FileSystem.ensureDir).toHaveBeenCalledWith(expect.stringContaining(projectName));
    expect(FileSystem.copy).toHaveBeenCalled();
  });
});
