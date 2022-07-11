import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { NiroConfig } from '@/core/types/niro-config.type';

export const NiroConfigFilePath = resolve(
  dirname(__dirname),
  './src',
  './core',
  './niro.config.json',
);
export const NiroOptions: NiroConfig = JSON.parse(
  readFileSync(NiroConfigFilePath, 'utf8'),
);
