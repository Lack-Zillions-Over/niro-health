import { Injectable } from '@nestjs/common';
import { File } from '@/files/entities';

@Injectable()
export class FilesParser {
  toJSON(file: File): Partial<File> {
    return {
      id: file.id,
      authorId: file.authorId,
      name: file.name,
      mimetype: file.mimetype,
      description: file.description,
      size: file.size,
      compressedSize: file.compressedSize,
      version: file.version,
      tags: file.tags,
      temporary: file.temporary,
      expiredAt: file.expiredAt,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
