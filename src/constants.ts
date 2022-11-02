import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { ProjectConfig } from '@/core/types/project-config.type';

export const ProjectConfigFilePath = resolve(
  dirname(__dirname),
  './src',
  './core',
  './project.config.json',
);
export const ProjectOptions: ProjectConfig = JSON.parse(
  readFileSync(ProjectConfigFilePath, 'utf8'),
);
