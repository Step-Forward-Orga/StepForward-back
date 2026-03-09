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

    const result = await service.create(createExerciseDto);

    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description,
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

    const result = await service.create(createExerciseDto);

    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: "",
      },
    });

    expect(result).toEqual(createdExercise);
  })

  it('should propagate an error if creation fails', async () => {
    // Arrange
    const createExerciseDto: CreateExerciseDto = {
      name: 'Bench Press',
      description: 'this is description',
    };

    const mockError = new Error('Database connection failed');

    mockPrisma.exercise.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(createExerciseDto)).rejects.toThrow(
      'Database connection failed',
    );
    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description,
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
      name: 'Bench Press',
      description: 'description',
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
      name: 'Non-existent Exercise',
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
      name: 'Error Test',
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
      name: 'Bench Press',
      description: 'this is description',
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