export class File {
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
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Meta = {
  gridFSId?: string;
};
