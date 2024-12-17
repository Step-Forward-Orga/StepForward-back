import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { WorkoutPlanController } from './workout-plan.controller';
import { WorkoutPlanService } from './workout-plan.service';

describe('WorkoutPlanController', () => {
  let controller: WorkoutPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutPlanController],
      providers: [WorkoutPlanService,
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

    controller = module.get<WorkoutPlanController>(WorkoutPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
