import { Test, TestingModule } from '@nestjs/testing';
import { MemeEmbedGetterService } from './meme-embed-getter.service';

describe('MemeEmbedGetterService', () => {
  let service: MemeEmbedGetterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemeEmbedGetterService],
    }).compile();

    service = module.get<MemeEmbedGetterService>(MemeEmbedGetterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
