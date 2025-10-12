import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

describe('ExerciseService - create', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      create: jest.fn(),
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
      exerciseName: 'Bench Press',
      restTime: 'PT1M30S',
      workoutId: 1,
      plannedSets: [
        { reps: 10, weight: 80, order: 1, type: 'PLANNED' },
        { reps: 8, weight: 85, order: 2, type: 'PLANNED' },
      ],
      completed: false,
    };

    const createdExercise = {
      id: 1,
      exerciseName: createExerciseDto.exerciseName,
      restTime: createExerciseDto.restTime,
      workoutId: createExerciseDto.workoutId,
      plannedSets: createExerciseDto.plannedSets,
      completed: false,
    };

    mockPrisma.exercise.create.mockResolvedValueOnce(createdExercise);

    const result = await service.create(createExerciseDto);

    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        exerciseName: createExerciseDto.exerciseName,
        restTime: createExerciseDto.restTime,
        completed: false,
        workoutId: createExerciseDto.workoutId,
        plannedSets: {
          create: [
            { reps: 10, weight: 80, order: 1, type: 'PLANNED' },
            { reps: 8, weight: 85, order: 2, type: 'PLANNED' },
          ],
        },
      },
      include: {
        plannedSets: true,
      },
    });

    expect(result).toEqual(createdExercise);
  });

  it('should propagate an error if creation fails', async () => {
    // Arrange
    const createExerciseDto: CreateExerciseDto = {
      exerciseName: 'Bench Press',
      restTime: 'PT1M30S',
      workoutId: 1,
      plannedSets: [
        { reps: 10, weight: 80, order: 1, type: 'PLANNED' },
        { reps: 8, weight: 85, order: 2, type: 'PLANNED' },
      ],
      completed: false,
    };

    const mockError = new Error('Database connection failed');

    mockPrisma.exercise.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(createExerciseDto)).rejects.toThrow(
      'Database connection failed',
    );
    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        exerciseName: createExerciseDto.exerciseName,
        restTime: createExerciseDto.restTime,
        completed: false,
        workoutId: createExerciseDto.workoutId,
        plannedSets: {
          create: [
            { reps: 10, weight: 80, order: 1, type: 'PLANNED' },
            { reps: 8, weight: 85, order: 2, type: 'PLANNED' },
          ],
        },
      },
      include: { plannedSets: true },
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
        exerciseName: 'Bench Press',
        exerciseId: 'ex-123',
        sets: 4,
        reps: 10,
        weight: 80,
        restTime: 'PT1M30S',
        planId: 1,
      },
      {
        id: 2,
        exerciseName: 'Deadlift',
        exerciseId: 'ex-456',
        sets: 3,
        reps: 8,
        weight: 100,
        restTime: 'PT2M',
        planId: 1,
      },
    ];

    mockPrisma.exercise.findMany.mockResolvedValueOnce(mockExercises);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.exercise.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockExercises);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockPrisma.exercise.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Database error');
    expect(prisma.exercise.findMany).toHaveBeenCalled();
  });
});

describe('ExerciseService - findOne', () => {
  let service: ExerciseService;
  let prisma: PrismaService;

  const mockPrisma = {
    exercise: {
      findUniqueOrThrow: jest.fn(),
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
      exerciseName: 'Bench Press',
      exerciseId: 'ex-123',
      sets: 4,
      reps: 10,
      weight: 80,
      restTime: 'PT1M30S',
      planId: 1,
    };

    mockPrisma.exercise.findUniqueOrThrow.mockResolvedValueOnce(mockExercise);

    // Act
    const result = await service.findOne(1);

    // Assert
    expect(prisma.exercise.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockExercise);
  });

  it('should throw an error if no exercise is found', async () => {
    // Arrange
    const mockError = new Error('Exercise not found');
    mockPrisma.exercise.findUniqueOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(1)).rejects.toThrow('Exercise not found');
    expect(prisma.exercise.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
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
      exerciseName: 'Updated Bench Press',
      sets: 5,
      reps: 12,
    };

    const updatedExercise = {
      id: 1,
      exerciseName: 'Updated Bench Press',
      sets: 5,
      reps: 12,
      weight: 80,
      restTime: 'PT1M30S',
      planId: 1,
    };

    mockPrisma.exercise.update.mockResolvedValueOnce(updatedExercise);

    // Act
    const result = await service.update(1, updateExerciseDto);

    // Assert
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateExerciseDto,
    });
    expect(result).toEqual(updatedExercise);
  });

  it('should throw an error if the exercise to update is not found', async () => {
    // Arrange
    const updateExerciseDto = {
      exerciseName: 'Non-existent Exercise',
    };

    const mockError = new Error('Exercise not found');

    mockPrisma.exercise.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(999, updateExerciseDto)).rejects.toThrow(
      'Exercise not found',
    );
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 999 },
      data: updateExerciseDto,
    });
  });

  it('should propagate an error if update fails', async () => {
    // Arrange
    const updateExerciseDto = {
      exerciseName: 'Error Test',
    };

    const mockError = new Error('Database error');

    mockPrisma.exercise.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(1, updateExerciseDto)).rejects.toThrow(
      'Database error',
    );
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
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
      exerciseName: 'Bench Press',
      exerciseId: 'ex-123',
      sets: 4,
      reps: 10,
      weight: 80,
      restTime: 'PT1M30S',
      planId: 1,
    };

    mockPrisma.exercise.delete.mockResolvedValueOnce(mockDeletedExercise);

    // Act
    const result = await service.remove(1);

    // Assert
    expect(prisma.exercise.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockDeletedExercise);
  });

  it('should throw an error if the exercise does not exist', async () => {
    // Arrange
    const mockError = new Error('Exercise not found');
    mockPrisma.exercise.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(999)).rejects.toThrow('Exercise not found');
    expect(prisma.exercise.delete).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});