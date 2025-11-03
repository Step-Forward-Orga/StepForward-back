import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import * as HandleErrors from '../utils/handle-errors';

describe('ExerciseController', () => {
  let controller: ExerciseController;
  let handleErrorsSpy: jest.SpyInstance;

  beforeEach(async () => {
    handleErrorsSpy = jest.spyOn(HandleErrors, 'handleErrors').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
      providers: [
        ExerciseService,
        {
          provide: PrismaService,
          useValue: {
            trainingNote: {
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
    controller = module.get<ExerciseController>(ExerciseController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockExercise = {
    id: 1,
    exerciseName: 'Bench Press',
    completed: false,
    restTime: 'PT1M',
    plannedSets: [],
    completedSets: [],
    workout: {},
    note: {},
  };

  const mockExerciseEntity = expect.any(Object);

  it('should create an exercise', async () => {
    const module = (await import('@nestjs/testing')).TestingModule;
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'create').mockResolvedValueOnce(mockExercise as any);
    // controller is already in scope
    const result = await controller.create({} as any);
    expect(result).toEqual(mockExerciseEntity);
  });

  it('should return all exercises', async () => {
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockExercise] as any);
    const result = await controller.findAll();
    expect(result).toEqual([mockExerciseEntity]);
  });

  it('should return one exercise', async () => {
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockExercise as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockExerciseEntity);
  });

  it('should update an exercise', async () => {
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'update').mockResolvedValueOnce(mockExercise as any);
    const result = await controller.update('1', {} as any);
    expect(result).toEqual(mockExerciseEntity);
  });

  it('should complete an exercise', async () => {
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'complete').mockResolvedValueOnce(mockExercise as any);
    const result = await controller.complete('1', {} as any);
    expect(result).toEqual(mockExerciseEntity);
  });

  it('should remove an exercise', async () => {
    const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
    jest.spyOn(service, 'remove').mockResolvedValueOnce(mockExercise as any);
    const result = await controller.remove('1');
    expect(result).toEqual(mockExerciseEntity);
  });

  it('should handle errors in create', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('create error'));
      await controller.create({} as any);
      expect(handleErrorsSpy).toHaveBeenCalled();
    });

    it('should handle errors in findAll', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error('findAll error'));
      await controller.findAll();
      expect(handleErrorsSpy).toHaveBeenCalled();
    });

    it('should handle errors in findOne', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error('findOne error'));
      await controller.findOne('1');
      expect(handleErrorsSpy).toHaveBeenCalled();
    });

    it('should handle errors in update', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error('update error'));
      await controller.update('1', {} as any);
      expect(handleErrorsSpy).toHaveBeenCalled();
    });

    it('should handle errors in complete', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'complete').mockRejectedValueOnce(new Error('complete error'));
      await controller.complete('1', {} as any);
      expect(handleErrorsSpy).toHaveBeenCalled();
    });

    it('should handle errors in remove', async () => {
      const service = (global as any).module?.get?.(ExerciseService) || (await import('./exercise.service')).ExerciseService.prototype;
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('remove error'));
      await controller.remove('1');
      expect(handleErrorsSpy).toHaveBeenCalled();
    });
});
