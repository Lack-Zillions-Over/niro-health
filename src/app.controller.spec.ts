import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return message on project', () => {
      expect(appController.author).toBe('@GuilhermeSantos001');
      expect(appController.credits).toBe(
        'Niro Health ©2022 Created by @GuilhermeSantos001',
      );
    });
  });
});
