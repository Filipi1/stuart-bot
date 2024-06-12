import { Test, TestingModule } from '@nestjs/testing';
import { CoachTelegramService } from './coach-telegram.service';

describe('CoachTelegramService', () => {
  let service: CoachTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachTelegramService],
    }).compile();

    service = module.get<CoachTelegramService>(CoachTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
