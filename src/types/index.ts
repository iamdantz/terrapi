export interface CLIOptions {
  verbose?: boolean;
  output?: string;
  force?: boolean;
}

export interface InitOptions extends CLIOptions {
  name?: string;
  provider?: TerraformProvider;
  externalModules?: boolean;
  gitInit?: boolean;
  path?: string;
}

export type TerraformProvider = 'aws' | 'azure' | 'gcp';

export interface TerraformProject {
  name: string;
  provider: TerraformProvider;
  externalModules: boolean;
  gitInit: boolean;
  projectPath: string;
}

export interface ModuleConfig {
  name: string;
  provider: TerraformProvider;
  files: {
    main: string;
    variables: string;
    outputs: string;
  };
}

export interface SpinnerOptions {
  text: string;
  color?: 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';
