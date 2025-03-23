import { Test, TestingModule } from '@nestjs/testing';
import { NobodyamCommandService } from './nobodyam-command.service';

describe('NobodyamCommandService', () => {
  let service: NobodyamCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NobodyamCommandService],
    }).compile();

    service = module.get<NobodyamCommandService>(NobodyamCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
