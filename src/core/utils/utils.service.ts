import { Injectable } from '@nestjs/common';

import { EmailSend } from '@/core/utils/emailSend';
import { Random } from '@/core/utils/random';
import { StringEx } from '@/core/utils/stringEx';
import { SimilarityFilter } from '@/core/utils/similarityFilter';
import { LocalPath } from '@/core/utils/localPath';

@Injectable()
export class UtilsService {
  public emailSend() {
    return new EmailSend();
  }

  public random() {
    return new Random();
  }

  public stringEx() {
    return new StringEx();
  }

  public similarityFilter() {
    return new SimilarityFilter();
  }

  public localPath() {
    return new LocalPath();
  }
}
