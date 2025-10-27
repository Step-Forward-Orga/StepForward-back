import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramService } from './workout-program.service';
import { PrismaService } from '../prisma/prisma.service'; // adjust path if needed

describe('WorkoutProgramService', () => {
  let service: WorkoutProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutProgramService,
        {
          provide: PrismaService,
          useValue: {
            workoutProgram: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WorkoutProgramService>(WorkoutProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});