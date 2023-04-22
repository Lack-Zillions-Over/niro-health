import { CoreEntityContract } from '@app/core/contracts/coreEntity';
import type { Meta } from '@app/files/types';

export class File extends CoreEntityContract {
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

  constructor(data: Partial<File>) {
    super(data);
    this.authorId = data?.authorId;
    this.name = data?.name;
    this.mimetype = data?.mimetype;
    this.description = data?.description;
    this.size = data?.size;
    this.compressedSize = data?.compressedSize;
    this.version = data?.version;
    this.temporary = data?.temporary;
    this.tags = data?.tags;
    this.meta = data?.meta;
  }
}
