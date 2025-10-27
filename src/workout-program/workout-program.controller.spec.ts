import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { WorkoutProgramController } from './workout-program.controller';
import { WorkoutProgramService } from './workout-program.service';

describe('WorkoutController', () => {
  let controller: WorkoutProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutProgramController],
      providers: [WorkoutProgramService,
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

    controller = module.get<WorkoutProgramController>(WorkoutProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
