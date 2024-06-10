import { Test, TestingModule } from '@nestjs/testing';
import { NewMemeCommandService } from './new-meme-command.service';

describe('NewMemeCommandService', () => {
  let service: NewMemeCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewMemeCommandService],
    }).compile();

    service = module.get<NewMemeCommandService>(NewMemeCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
