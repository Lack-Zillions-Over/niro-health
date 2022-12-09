import { Meta } from '@/schemas/files/types/meta';

declare interface FileSchema {
  id: string;
  authorId: string;
  name: string;
  mimetype: string;
  description: string;
  size: number;
  compressedSize: number;
  version: number;
  temporary: boolean;
  tags: string[];
  meta: Meta;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default FileSchema;
