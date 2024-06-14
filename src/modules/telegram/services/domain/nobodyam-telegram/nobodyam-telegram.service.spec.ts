import { Test, TestingModule } from '@nestjs/testing';
import { NobodyamTelegramService } from './nobodyam-telegram.service';

describe('NobodyamTelegramService', () => {
  let service: NobodyamTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NobodyamTelegramService],
    }).compile();

    service = module.get<NobodyamTelegramService>(NobodyamTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
