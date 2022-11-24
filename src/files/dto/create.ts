import type { Meta } from '@/files/entities';

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
