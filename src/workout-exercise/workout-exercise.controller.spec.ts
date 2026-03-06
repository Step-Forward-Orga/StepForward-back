import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutExerciseController } from './workout-exercise.controller';
import { WorkoutExerciseService } from './workout-exercise.service';

describe('WorkoutExerciseController', () => {
  let controller: WorkoutExerciseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutExerciseController],
      providers: [WorkoutExerciseService],
    }).compile();

    controller = module.get<WorkoutExerciseController>(WorkoutExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
