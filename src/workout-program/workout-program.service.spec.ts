import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramService } from './workout-program.service';

describe('WorkoutProgramService', () => {
  let service: WorkoutProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutProgramService],
    }).compile();

    service = module.get<WorkoutProgramService>(WorkoutProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
