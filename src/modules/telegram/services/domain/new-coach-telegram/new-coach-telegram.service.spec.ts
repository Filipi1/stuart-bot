import { Test, TestingModule } from '@nestjs/testing';
import { NewCoachTelegramService } from './new-coach-telegram.service';

describe('NewCoachTelegramService', () => {
  let service: NewCoachTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewCoachTelegramService],
    }).compile();

    service = module.get<NewCoachTelegramService>(NewCoachTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
