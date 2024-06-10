import { Test, TestingModule } from '@nestjs/testing';
import { RandomMemeGetterService } from './random-meme-getter.service';

describe('RandomMemeGetterService', () => {
  let service: RandomMemeGetterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomMemeGetterService],
    }).compile();

    service = module.get<RandomMemeGetterService>(RandomMemeGetterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
