import { Test, TestingModule } from '@nestjs/testing';
import { MemeCreatorService } from './meme-creator.service';

describe('MemeCreatorService', () => {
  let service: MemeCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemeCreatorService],
    }).compile();

    service = module.get<MemeCreatorService>(MemeCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
