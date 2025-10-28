import { WorkoutProgramEntity } from './entities/workout-program.entity';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { WorkoutProgramController } from './workout-program.controller';
import { WorkoutProgramService } from './workout-program.service';
import { UserEntity } from '../user/entities/user.entity';
import { NotesEntity } from '../notes/entities/notes.entity';
import { WorkoutEntity } from '..//workout/entities/workout.entity';

describe('WorkoutController', () => {
  let controller: WorkoutProgramController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [WorkoutProgramController],
      providers: [
        {
          provide: WorkoutProgramService,
          useValue: {
            create: jest.fn(),
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

    controller = module.get<WorkoutProgramController>(WorkoutProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a workout program', async () => {
    const dto: CreateWorkoutProgramDto = { title: 'Program A', description: 'Details' };
    const mockReturn = { id: 1, title: dto.title, description: dto.description, user: { id: 1, username: 'john', email: 'john@example.com' }, workouts: [], note: null };
    const service = module.get<WorkoutProgramService>(WorkoutProgramService);
    (service.create as jest.Mock).mockResolvedValue(mockReturn);

    const result = await controller.create({ sub: 1 } as any, dto);
    expect(result).toEqual(new WorkoutProgramEntity(mockReturn));
  });

  it('should return all workout programs', async () => {
    const mockPrograms = [{ id: 1, title: 'A', description: '', user: { id: 1, username: 'john', email: 'john@example.com' }, workouts: [], note: null }];
    const service = module.get<WorkoutProgramService>(WorkoutProgramService);
    (service.findAll as jest.Mock).mockResolvedValue(mockPrograms);

    const result = await controller.findAll();
    expect(result).toEqual(mockPrograms.map(p => new WorkoutProgramEntity(p)));
  });

  it('should return one workout program', async () => {
    const mockProgram = { id: 1, title: 'A', description: '', user: { id: 1, username: 'john', email: 'john@example.com' }, workouts: [], note: null };
    const service = module.get<WorkoutProgramService>(WorkoutProgramService);
    (service.findOne as jest.Mock).mockResolvedValue(mockProgram);

    const result = await controller.findOne('1');
    expect(result).toEqual(new WorkoutProgramEntity(mockProgram));
  });

  it('should instantiate all nested entities', () => {
    const mock = {
      id: 123,
      title: 'Test Program',
      description: 'test desc',
      createdAt: new Date(),
      userId: 1,
      noteId: 1,
      user: { id: 1, email: 'a@b.com', username: 'tester' },
      note: { id: 1, note: 'sample', createdAt: new Date(), userId: 1, workoutId: 1, title: 'n', workoutCycleId: 1, exerciseId: 1 },
      workouts: [{ id: 1, title: 'w', description: '', createdAt: new Date(), userId: 1, user: { id: 1, email: 'a@b.com', username: 'tester' }, noteId: 1, workoutProgramId: 1 }]
    };

    const entity = new WorkoutProgramEntity(mock);
    expect(entity.user).toBeInstanceOf(UserEntity);
    expect(entity.note).toBeInstanceOf(NotesEntity);
    expect(entity.workouts?.[0]).toBeInstanceOf(WorkoutEntity);
  });

  it('should update a workout program', async () => {
    const dto: UpdateWorkoutProgramDto = { title: 'Updated' };
    const updated = { id: 1, title: dto.title, description: '', user: { id: 1, username: 'john', email: 'john@example.com' }, workouts: [], note: null };
    const service = module.get<WorkoutProgramService>(WorkoutProgramService);
    (service.update as jest.Mock).mockResolvedValue(updated);

    const result = await controller.update('1', dto);
    expect(result).toEqual(new WorkoutProgramEntity(updated));
  });

  it('should delete a workout program', async () => {
    const deleted = { id: 1, title: 'ToDelete', description: '', user: { id: 1, username: 'john', email: 'john@example.com' }, workouts: [], note: null };
    const service = module.get<WorkoutProgramService>(WorkoutProgramService);
    (service.remove as jest.Mock).mockResolvedValue(deleted);

    const result = await controller.remove('1');
    expect(result).toEqual(new WorkoutProgramEntity(deleted));
  });
});
