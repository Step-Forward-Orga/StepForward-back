import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { JwtType } from '../authentication/enums/JwtType.enum';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('WorkoutController', () => {
  let controller: WorkoutController;
  let workoutService: WorkoutService;

  const mockWorkoutService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutController],
      providers: [
        {
          provide: WorkoutService,
          useValue: mockWorkoutService,
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
          },
        },
        Reflector,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    controller = module.get<WorkoutController>(WorkoutController);
    workoutService = module.get<WorkoutService>(WorkoutService);
  });

  describe('create', () => {
    it('should call workout.create and success', async () => {
      const dto: CreateWorkoutDto = { title: 'Upper 1', description: "First upper of the week" };
      const user : JwtPayload = { sub: 1,
        exp: Date.now() + 1000 * 60 * 60, // 1 hour in the future
        jti: 'test-jti',
        iat: Date.now(),
        type: JwtType.ACCESS
      };
      const result = { id: 1, title: "Upper 1", description: "First upper of the week"};
      mockWorkoutService.create.mockResolvedValue(result);

      expect(await controller.create(user, dto)).toEqual(result);
      expect(mockWorkoutService.create).toHaveBeenCalledWith(user.sub, dto);
    });

    it('should call workout.controller.create and fail', async () => {
      const dto: CreateWorkoutDto = { title: 'Upper 1', description: null };
      const user : JwtPayload = { sub: 1,
        exp: Date.now() + 1000 * 60 * 60, // 1 hour in the future
        jti: 'test-jti',
        iat: Date.now(),
        type: JwtType.ACCESS
      };
      const error = new InternalServerErrorException("Internal Server Error");
      mockWorkoutService.create.mockRejectedValueOnce(error);

      // Spy on the handleErrors function
      const handleErrorsSpy = jest.spyOn(require('../utils/handle-errors'), 'handleErrors');
      try { await controller.create(user, dto); } catch {}
      expect(handleErrorsSpy).toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should call workout.controller.findAll and return all workouts', async () => {
      const result = [{ id: 1, name: 'Leg Day' }];
      mockWorkoutService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });

    it('should call workout.controller.findAll and fail', async () => {
      const error = new Error('Something went wrong');
      mockWorkoutService.findAll.mockRejectedValueOnce(error);
      const handleErrorsSpy = jest.spyOn(require('../utils/handle-errors'), 'handleErrors');

      try {
        await controller.findAll();
      } catch (e) {
        // expected error, do nothing
      }
      expect(handleErrorsSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should call workout.controller.findOne and return one workout by id', async () => {
      const result = { id: 1, name: 'Back Day' };
      mockWorkoutService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockWorkoutService.findOne).toHaveBeenCalledWith(1);
    });

    it('should call workout.controller.findOne and fail', async () => {
      const error = new Error('Something went wrong');
      mockWorkoutService.findOne.mockRejectedValueOnce(error);
      const handleErrorsSpy = jest.spyOn(require('../utils/handle-errors'), 'handleErrors');

      try {
        await controller.findOne('1');
      } catch (e) {
        // expected error, do nothing
      }
      expect(handleErrorsSpy).toHaveBeenCalledWith(error);
    })
  });

  describe('update', () => {
    it('should call workout.controller.update and return the updated workout', async () => {
      const dto: UpdateWorkoutDto = { title: 'Updated Name', description: 'Updated first upper of the week' };
      const result = { id: 1, title: 'Updated Name', description: 'Updated first upper of the week' };
      mockWorkoutService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(mockWorkoutService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should call workout.controller.update and fail', async () => {
      const dto: UpdateWorkoutDto = { title: 'Updated Name', description: 'Updated first upper of the week' };
      const error = new BadRequestException('Invalid data');
      mockWorkoutService.update.mockRejectedValueOnce(error);
      const handleErrorsSpy = jest.spyOn(require('../utils/handle-errors'), 'handleErrors');

      try {
        await controller.update('1', dto);
      } catch (e) {
        // expected error, do nothing
      }
      expect(handleErrorsSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('should call workout.controller.remove and return the result', async () => {
      const result = { id: 1, deleted: true };
      mockWorkoutService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockWorkoutService.remove).toHaveBeenCalledWith(1);
    });

    it('should call workout.controller.remove and fail', async () => {
      const error = new Error('Something went wrong');
      mockWorkoutService.remove.mockRejectedValueOnce(error);
      const handleErrorsSpy = jest.spyOn(require('../utils/handle-errors'), 'handleErrors');
      
      try {
        await controller.remove('1');
      } catch (e) {
        // expected error, do nothing
      }
      expect(handleErrorsSpy).toHaveBeenCalledWith(error);
    });
  });
});