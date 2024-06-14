import { Test, TestingModule } from '@nestjs/testing';
import { UndrawedMemesGetterService } from './undrawed-memes-getter.service';

describe('UndrawedMemesGetterService', () => {
  let service: UndrawedMemesGetterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UndrawedMemesGetterService],
    }).compile();

    service = module.get<UndrawedMemesGetterService>(UndrawedMemesGetterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
