import { Test, TestingModule } from '@nestjs/testing';
import { GetOrCreateUserService } from './get-or-create-user.service';

describe('GetOrCreateUserService', () => {
  let service: GetOrCreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetOrCreateUserService],
    }).compile();

    service = module.get<GetOrCreateUserService>(GetOrCreateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
