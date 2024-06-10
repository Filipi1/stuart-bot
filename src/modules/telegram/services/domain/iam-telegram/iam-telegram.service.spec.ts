import { Test, TestingModule } from '@nestjs/testing';
import { IamTelegramService } from './iam-telegram.service';

describe('IamTelegramService', () => {
  let service: IamTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IamTelegramService],
    }).compile();

    service = module.get<IamTelegramService>(IamTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
