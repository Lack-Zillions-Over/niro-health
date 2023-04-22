import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import type { IDebugService } from '@app/debug';
import { FilesService } from '@app/files';

@Injectable()
export class FilesClearTemporarySchedule {
  constructor(
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('IFilesService') private readonly filesService: FilesService,
  ) {}

  private async handle() {
    const files = await this.filesService.findByTemporary();
    this.debugService.debug(`Cleaning temporary files(${files.length})...`);
    for await (const file of files) {
      if (new Date(file.expiredAt) < new Date()) {
        const removed = await this.filesService.delete(file.id as string);

        if (removed instanceof Error) {
          this.debugService.debug(
            `Error removing file(${file.id}): ${removed}`,
          );
        } else {
          this.debugService.debug(`File(${file.id}) removed`);
        }
      }
    }
  }

  @Cron('0 0 */1 * * *') // ! Every 1 hour
  async handleCron() {
    this.debugService.debug(`Cron job started at ${new Date().toISOString()}`);
    await this.handle();
    this.debugService.debug(`Cron job ended at ${new Date().toISOString()}`);
  }
}
