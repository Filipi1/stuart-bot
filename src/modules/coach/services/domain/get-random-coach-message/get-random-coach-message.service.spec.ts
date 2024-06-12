import { Test, TestingModule } from '@nestjs/testing';
import { GetRandomCoachMessageService } from './get-random-coach-message.service';

describe('GetRandomCoachMessageService', () => {
  let service: GetRandomCoachMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetRandomCoachMessageService],
    }).compile();

    service = module.get<GetRandomCoachMessageService>(GetRandomCoachMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
