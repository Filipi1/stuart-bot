import { Test, TestingModule } from '@nestjs/testing';
import { NewCoachController } from './new-coach.controller';

describe('NewCoachController', () => {
  let controller: NewCoachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewCoachController],
    }).compile();

    controller = module.get<NewCoachController>(NewCoachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
