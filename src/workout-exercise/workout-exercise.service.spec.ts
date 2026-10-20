import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { WorkoutExerciseService } from './workout-exercise.service';
import { PrismaService } from '../prisma/prisma.service';
import { PlannedSetDto } from './dto/planned-set.dto';

const topSet: PlannedSetDto = { order: 1, repsMin: 6, repsMax: 8, weight: 100 };
const backOffSet: PlannedSetDto = { order: 2, repsMin: 10, repsMax: 10, weight: 75 };
const bodyweightSet: PlannedSetDto = { order: 3, repsMin: 8, repsMax: 12 };

const ownedExercise = (id: number) => ({ connect: { id, OR: [{ userId: null }, { userId: 1 }] } });

describe('WorkoutExerciseService', () => {
  let service: WorkoutExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    workoutExercise: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutExerciseService>(WorkoutExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a workout exercise in an owned workout with planned sets', async () => {
    const dto = { exerciseId: 4, plannedSets: [topSet, backOffSet, bodyweightSet], restTime: 'PT3M', order: 2, workoutId: 7 };
    const created = { id: 1 };
    mockPrisma.workoutExercise.create.mockResolvedValueOnce(created);

    const result = await service.create(1, dto);

    expect(prisma.workoutExercise.create).toHaveBeenCalledWith({
      data: {
        exercise: ownedExercise(4),
        restTime: 'PT3M',
        order: 2,
        workout: { connect: { id: 7, userId: 1 } },
        plannedSets: {
          create: [
            { order: 1, repsMin: 6, repsMax: 8, weight: 100 },
            { order: 2, repsMin: 10, repsMax: 10, weight: 75 },
            { order: 3, repsMin: 8, repsMax: 12, weight: undefined },
          ],
        },
      },
      include: { plannedSets: true },
    });
    expect(result).toEqual(created);
  });

  it('should reject a planned set whose repsMax is below repsMin', async () => {
    const dto = { exerciseId: 4, plannedSets: [{ order: 1, repsMin: 10, repsMax: 8 }], restTime: 'PT3M', workoutId: 7 };

    await expect(service.create(1, dto)).rejects.toThrow(BadRequestException);
    expect(prisma.workoutExercise.create).not.toHaveBeenCalled();
  });

  it('should return the user workout-exercises filtered by workout and exercise name', async () => {
    mockPrisma.workoutExercise.findMany.mockResolvedValueOnce([]);

    await service.findAll(1, { workoutId: 7, search: 'bench', include: ['plannedSets', 'user'] });

    expect(prisma.workoutExercise.findMany).toHaveBeenCalledWith({
      where: {
        workout: { userId: 1 },
        workoutId: 7,
        exercise: { name: { contains: 'bench', mode: 'insensitive' } },
      },
      include: { plannedSets: true },
      skip: 0,
      take: 10,
      orderBy: { order: 'desc' },
    });
  });

  it('should return one owned workout-exercise', async () => {
    const item = { id: 1 };
    mockPrisma.workoutExercise.findFirstOrThrow.mockResolvedValueOnce(item);

    const result = await service.findOne(1, 1, ['exercise']);

    expect(prisma.workoutExercise.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 1, workout: { userId: 1 } },
      include: { exercise: true },
    });
    expect(result).toEqual(item);
  });

  it('should update, replacing planned sets and checking the new exercise', async () => {
    mockPrisma.workoutExercise.update.mockResolvedValueOnce({ id: 1 });

    await service.update(1, 1, { restTime: 'PT5M', exerciseId: 9, workoutId: 99, plannedSets: [topSet] });

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1, workout: { userId: 1 } },
      data: {
        restTime: 'PT5M',
        exercise: ownedExercise(9),
        plannedSets: { deleteMany: {}, create: [{ order: 1, repsMin: 6, repsMax: 8, weight: 100 }] },
      },
      include: { plannedSets: true },
    });
  });

  it('should update scalar fields only when no sets are given', async () => {
    mockPrisma.workoutExercise.update.mockResolvedValueOnce({ id: 1 });

    await service.update(1, 1, { restTime: 'PT1M', order: 3 });

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1, workout: { userId: 1 } },
      data: { restTime: 'PT1M', order: 3 },
      include: { plannedSets: true },
    });
  });

  it('should remove an owned workout-exercise', async () => {
    mockPrisma.workoutExercise.delete.mockResolvedValueOnce({ id: 1 });

    const result = await service.remove(1, 1);

    expect(prisma.workoutExercise.delete).toHaveBeenCalledWith({ where: { id: 1, workout: { userId: 1 } } });
    expect(result).toEqual({ id: 1 });
  });
});
