import { Test, TestingModule } from '@nestjs/testing';
import { CreateCoachMessageService } from './create-coach-message.service';

describe('CreateCoachMessageService', () => {
  let service: CreateCoachMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateCoachMessageService],
    }).compile();

    service = module.get<CreateCoachMessageService>(CreateCoachMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
