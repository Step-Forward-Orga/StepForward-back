import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramController } from './workout-program.controller';
import { WorkoutProgramService } from './workout-program.service';

describe('WorkoutProgramController', () => {
  let controller: WorkoutProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutProgramController],
      providers: [WorkoutProgramService],
    }).compile();

    controller = module.get<WorkoutProgramController>(WorkoutProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
