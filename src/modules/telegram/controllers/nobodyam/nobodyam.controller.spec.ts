import { Test, TestingModule } from '@nestjs/testing';
import { NobodyamController } from './nobodyam.controller';

describe('NobodyamController', () => {
  let controller: NobodyamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NobodyamController],
    }).compile();

    controller = module.get<NobodyamController>(NobodyamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
