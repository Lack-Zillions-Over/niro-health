import type { Meta } from '@app/files/types';

export class CreateFileDto {
  authorId: string;
  name: string;
  mimetype: string;
  description?: string;
  size: number;
  compressedSize: number;
  temporary: boolean;
  tags: string[];
  meta: Meta;
}
