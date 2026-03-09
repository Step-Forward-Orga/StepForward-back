import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutExerciseController } from './workout-exercise.controller';
import { WorkoutExerciseService } from './workout-exercise.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { Reflector, APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WorkoutExerciseEntity } from './entities/workout-exercise.entity';
import * as HandleErrors from '../utils/handle-errors';

describe('WorkoutExerciseController', () => {
  let controller: WorkoutExerciseController;
  let testingModule: TestingModule;
  let service: WorkoutExerciseService;
  let handleErrorsSpy: jest.SpyInstance;

  beforeEach(async () => {
    handleErrorsSpy = jest.spyOn(HandleErrors, 'handleErrors').mockImplementation(() => {});
    testingModule = await Test.createTestingModule({
      controllers: [WorkoutExerciseController],
      providers: [
        {
          provide: WorkoutExerciseService,
          useValue: {
            create: jest.fn(),
            complete: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          }
        },
        {
          provide: PrismaService,
          useValue: {
            workout: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          }
        },
        Reflector, // Reflector is required for guards
        {
          provide: APP_GUARD,
          useClass: AuthGuard, // Use a mocked AuthGuard
        },
      ],
  }).compile();

    controller = testingModule.get<WorkoutExerciseController>(WorkoutExerciseController);
    service = testingModule.get<WorkoutExerciseService>(WorkoutExerciseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockWorkoutExercise = {
    id: 1,
    exercise: {
      id: 1,
      name: "bench",
      description: "this is desc"
    },
    completed: false,
    restTime: 'PT1M',
    plannedSets: [],
    completedSets: [],
  };

  const mockWorkoutExerciseEntity = expect.any(Object);

  it('should create an exercise', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.create({} as any);

    expect(service.create).toHaveBeenCalledWith({} as any);
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should return all exercises', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalledWith();
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should return one exercise', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should update an exercise', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.update('1', {} as any);

    expect(service.update).toHaveBeenCalledWith(1, {});
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should complete an exercise', async () => {
    jest.spyOn(service, 'complete').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.complete('1', {} as any);

    expect(service.complete).toHaveBeenCalledWith(1, {});
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should remove an exercise', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce(mockWorkoutExercise as any);
    const result = await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(new WorkoutExerciseEntity(mockWorkoutExercise as any));
  });

  it('should handle errors in create', async () => {
    jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('create error'));
    await controller.create({} as any);

    expect(service.create).toHaveBeenCalledWith({} as any);
    expect(handleErrorsSpy).toHaveBeenCalled();
  });

  it('should handle errors in findAll', async () => {
    jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error('create error'));
    await controller.findAll();

    expect(service.findAll).toHaveBeenCalledWith();
    expect(handleErrorsSpy).toHaveBeenCalled();
  });

  it('should handle errors in findOne', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error('create error'));
    await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(handleErrorsSpy).toHaveBeenCalled();
  });

  it('should handle errors in update', async () => {
    jest.spyOn(service, 'update').mockRejectedValueOnce(new Error('create error'));
    await controller.update('1', {} as any);

    expect(service.update).toHaveBeenCalledWith(1, {});
    expect(handleErrorsSpy).toHaveBeenCalled();
  });

  it('should handle errors in complete', async () => {
    jest.spyOn(service, 'complete').mockRejectedValueOnce(new Error('create error'));
    await controller.complete('1', {} as any);

    expect(service.complete).toHaveBeenCalledWith(1, {});
    expect(handleErrorsSpy).toHaveBeenCalled();
  });

  it('should handle errors in remove', async () => {
    jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('create error'));
    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(handleErrorsSpy).toHaveBeenCalled();
  });
});
