import { Test, TestingModule } from '@nestjs/testing';
import { IamTelegramService } from './iam-telegram.service';
import { DropboxServiceProvider } from 'src/modules/shared/services/dropbox/__mocks__/dropbox.provider';
import { LoggerServiceProvider } from 'src/modules/shared/services/logger/__mocks__/logger.provider';
import { RandomMemeGetterServiceProvider } from 'src/modules/meme/__mocks__/services/random-meme-getter-service.provider';

describe('IamTelegramService', () => {
  let service: IamTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamTelegramService,
        DropboxServiceProvider,
        RandomMemeGetterServiceProvider,
        LoggerServiceProvider
      ],
    }).compile();

    service = module.get<IamTelegramService>(IamTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
