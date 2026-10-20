import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { ExerciseService, summarizeSets } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

describe('ExerciseService - create', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully create a new exercise', async () => {
    const createExerciseDto: CreateExerciseDto = {
      name: 'Bench Press',
      description: 'this is description',
    };

    const createdExercise = {
      id: 1,
      name: createExerciseDto.name,
      description: createExerciseDto.description,
    };

    mockPrisma.exercise.create.mockResolvedValueOnce(createdExercise);

    const result = await service.create(1, false, createExerciseDto);

    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description,
        userId: 1,
      },
    });

    expect(result).toEqual(createdExercise);
  });

  it ('should create an exercise without description', async () => {
    const createExerciseDto: CreateExerciseDto = {
      name: 'Bench Press',
    };

    const createdExercise = {
      id: 1,
      name: createExerciseDto.name,
      description: "",
    };

    mockPrisma.exercise.create.mockResolvedValueOnce(createdExercise);

    const result = await service.create(1, false, createExerciseDto);

    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: "",
        userId: 1,
      },
    });

    expect(result).toEqual(createdExercise);
  })

  it('should refuse a second global exercise with the same name', async () => {
    mockPrisma.exercise.create.mockClear();
    mockPrisma.exercise.findFirst.mockResolvedValueOnce({ id: 1, name: 'Bench Press', userId: null });

    await expect(service.create(1, true, { name: 'Bench Press' })).rejects.toThrow(ConflictException);
    expect(prisma.exercise.findFirst).toHaveBeenCalledWith({ where: { name: 'Bench Press', userId: null } });
    expect(prisma.exercise.create).not.toHaveBeenCalled();
  });

  it('should propagate an error if creation fails', async () => {
    // Arrange
    const createExerciseDto: CreateExerciseDto = {
      name: 'Bench Press',
      description: 'this is description',
    };

    const mockError = new Error('Database connection failed');

    mockPrisma.exercise.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(1, true, createExerciseDto)).rejects.toThrow(
      'Database connection failed',
    );
    // admins write to the global catalog
    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description,
        userId: null,
      },
    });
  });
});

describe('ExerciseService - findAll', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all exercises successfully', async () => {
    // Arrange
    const mockExercises = [
      {
        id: 1,
        name: 'Bench Press',
        description: 'this is description'
      },
      {
        id: 2,
        name: 'Deadlift',
        description: 'this is description',
      },
    ];

    mockPrisma.exercise.findMany.mockResolvedValueOnce(mockExercises);

    // Act
    const result = await service.findAll(1, { search: 'press' });

    // Assert
    expect(prisma.exercise.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          { OR: [{ userId: null }, { userId: 1 }] },
          {
            OR: [
              { name: { contains: 'press', mode: 'insensitive' } },
              { description: { contains: 'press', mode: 'insensitive' } },
            ],
          },
        ],
      },
      skip: 0,
      take: 10,
      orderBy: { name: 'desc' },
    });
    expect(result).toEqual(mockExercises);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockPrisma.exercise.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll(1, {})).rejects.toThrow('Database error');
    expect(prisma.exercise.findMany).toHaveBeenCalled();
  });
});

describe('ExerciseService - findOne', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      findFirstOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return an exercise when found', async () => {
    // Arrange
    const mockExercise = {
      id: 1,
      name: 'Bench Press',
      description: 'description',
    };

    mockPrisma.exercise.findFirstOrThrow.mockResolvedValueOnce(mockExercise);

    // Act
    const result = await service.findOne(1, 1);

    // Assert
    expect(prisma.exercise.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 1, OR: [{ userId: null }, { userId: 1 }] },
    });
    expect(result).toEqual(mockExercise);
  });

  it('should throw an error if no exercise is found', async () => {
    // Arrange
    const mockError = new Error('Exercise not found');
    mockPrisma.exercise.findFirstOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(1, 1)).rejects.toThrow('Exercise not found');
    expect(prisma.exercise.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 1, OR: [{ userId: null }, { userId: 1 }] },
    });
  });
});

describe('ExerciseService - update', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update an exercise', async () => {
    // Arrange
    const updateExerciseDto = {
      name: 'Updated Bench Press',
      description: 'updated this is description',
    };

    const updatedExercise = {
      id: 1,
      name: 'Updated Bench Press',
      description: 'updated this is description',
    };

    mockPrisma.exercise.update.mockResolvedValueOnce(updatedExercise);

    // Act
    const result = await service.update(1, 1, false, updateExerciseDto);

    // Assert
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 },
      data: updateExerciseDto,
    });
    expect(result).toEqual(updatedExercise);
  });

  it('should throw an error if the exercise to update is not found', async () => {
    // Arrange
    const updateExerciseDto = {
      name: 'Non-existent Exercise',
    };

    const mockError = new Error('Exercise not found');

    mockPrisma.exercise.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(999, 1, false, updateExerciseDto)).rejects.toThrow(
      'Exercise not found',
    );
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 999, userId: 1 },
      data: updateExerciseDto,
    });
  });

  it('should propagate an error if update fails', async () => {
    // Arrange
    const updateExerciseDto = {
      name: 'Error Test',
    };

    const mockError = new Error('Database error');

    mockPrisma.exercise.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(1, 1, false, updateExerciseDto)).rejects.toThrow(
      'Database error',
    );
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 },
      data: updateExerciseDto,
    });
  });
});

describe('ExerciseService - remove', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully delete an exercise', async () => {
    // Arrange
    const mockDeletedExercise = {
      id: 1,
      name: 'Bench Press',
      description: 'this is description',
    };

    mockPrisma.exercise.delete.mockResolvedValueOnce(mockDeletedExercise);

    // Act
    const result = await service.remove(1, 1, true);

    // Assert
    expect(prisma.exercise.delete).toHaveBeenCalledWith({
      where: { id: 1, OR: [{ userId: null }, { userId: 1 }] },
    });
    expect(result).toEqual(mockDeletedExercise);
  });

  it('should throw an error if the exercise does not exist', async () => {
    // Arrange
    const mockError = new Error('Exercise not found');
    mockPrisma.exercise.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(999, 1, true)).rejects.toThrow('Exercise not found');
    expect(prisma.exercise.delete).toHaveBeenCalledWith({
      where: { id: 999, OR: [{ userId: null }, { userId: 1 }] },
    });
  });
});
describe('summarizeSets', () => {
  it('picks the heaviest set (most reps on a tie), total volume and best Epley 1RM', () => {
    const result = summarizeSets([
      { reps: 8, weight: 80 },
      { reps: 6, weight: 85 },
      { reps: 9, weight: 85 },
      { reps: 0, weight: 100 },
    ]);

    expect(result.topSet).toEqual({ reps: 0, weight: 100 });
    expect(result.volume).toBe(8 * 80 + 6 * 85 + 9 * 85);
    // failed set (0 reps) is ignored for the 1RM: best is 85 * (1 + 9 / 30) = 110.5
    expect(result.estimatedOneRepMax).toBe(110.5);
  });

  it('prefers more reps when the weight is the same', () => {
    expect(summarizeSets([{ reps: 6, weight: 85 }, { reps: 9, weight: 85 }]).topSet).toEqual({ reps: 9, weight: 85 });
  });

  it('handles an exercise with no sets', () => {
    expect(summarizeSets([])).toEqual({ topSet: null, volume: 0, estimatedOneRepMax: 0 });
  });
});

describe('ExerciseService - history', () => {
  const prisma = {
    exercise: { findFirstOrThrow: jest.fn() },
    sessionExercise: { findMany: jest.fn() },
  };
  const service = new ExerciseService(prisma as any);

  it('returns the latest sessions oldest first with their summary', async () => {
    prisma.exercise.findFirstOrThrow.mockResolvedValueOnce({ id: 3 });
    const sets = [{ reps: 8, weight: 80 }];
    prisma.sessionExercise.findMany.mockResolvedValueOnce([
      { note: null, sets, session: { id: 2, title: 'Upper 1', startedAt: new Date('2026-10-14') } },
      { note: 'easy', sets, session: { id: 1, title: 'Upper 1', startedAt: new Date('2026-10-07') } },
    ]);

    const result = await service.history(3, 1, 5);

    expect(prisma.exercise.findFirstOrThrow).toHaveBeenCalledWith({ where: { id: 3, OR: [{ userId: null }, { userId: 1 }] } });
    expect(prisma.sessionExercise.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { exerciseId: 3, session: { userId: 1 }, sets: { some: {} } },
        orderBy: { session: { startedAt: 'desc' } },
        take: 5,
      }),
    );
    expect(result.map((entry) => entry.sessionId)).toEqual([1, 2]);
    expect(result[0]).toEqual(expect.objectContaining({ note: 'easy', volume: 640, topSet: sets[0] }));
  });

  it('404s on an exercise the user cannot see', async () => {
    prisma.exercise.findFirstOrThrow.mockRejectedValueOnce(new Error('not found'));
    prisma.sessionExercise.findMany.mockClear();

    await expect(service.history(3, 1)).rejects.toThrow('not found');
    expect(prisma.sessionExercise.findMany).not.toHaveBeenCalled();
  });
});
