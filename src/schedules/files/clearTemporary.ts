import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { FilesService } from '@/files/files.service';

@Injectable()
export class FilesClearTemporarySchedule {
  private readonly logger = new Logger(FilesClearTemporarySchedule.name);

  constructor(private readonly filesService: FilesService) {}

  private async handle() {
    const files = await this.filesService.findByTemporary();

    this.logger.debug(`Cleaning temporary files(${files.length})...`);

    for await (const file of files) {
      if (new Date(file.expiredAt) < new Date()) {
        const removed = await this.filesService.remove(file.id);

        if (removed instanceof Error) {
          this.logger.debug(`Error removing file(${file.id}): ${removed}`);
        } else {
          this.logger.debug(`File(${file.id}) removed`);
        }
      }
    }
  }

  @Cron('0 0 */1 * * *') // * every hour
  async handleCron() {
    this.logger.debug(`Cron job started at ${new Date().toISOString()}`);
    await this.handle();
  }
}
