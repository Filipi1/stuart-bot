import { Test, TestingModule } from '@nestjs/testing';
import { IamCommandService } from './iam-command.service';

describe('IamCommandService', () => {
  let service: IamCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IamCommandService],
    }).compile();

    service = module.get<IamCommandService>(IamCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
