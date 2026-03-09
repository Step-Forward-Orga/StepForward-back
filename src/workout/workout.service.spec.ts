import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

describe('WorkoutService - create', () => {
  let service: WorkoutService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workout: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should create a workout without linking a workoutProgram when id is not provided', async () => {
    const userId = 1;
    const createWorkoutDto: CreateWorkoutDto = {
      title: 'My Solo Plan',
      description: 'No program attached',
    };

    const createdWorkout = {
      id: 2,
      userId,
      title: createWorkoutDto.title,
      description: createWorkoutDto.description,
      code: '',
      user: { id: 1, username: 'john' },
    };

    const updatedWorkout = {
      ...createdWorkout,
      code: 'my-solo-plan-2',
    };

    mockPrisma.workout.create.mockResolvedValueOnce(createdWorkout);
    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkout);

    const result = await service.create_linked(userId, createWorkoutDto, undefined as any);

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        code: '',
        workoutProgram: undefined,
      },
    });

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id: createdWorkout.id },
      data: { code: 'my-solo-plan-2' },
    });

    expect(result).toEqual(updatedWorkout);
  });

  it('should successfully create a workout plan', async () => {
    const userId = 1;
    const createWorkoutDto: CreateWorkoutDto = {
      title: 'My First Plan',
      description: 'A great workout plan',
    };

    const createdWorkoutLinked = {
      id: 1,
      userId: 1,
      title: 'My First Plan',
      description: 'A great workout plan',
      code: '',
      user: { id: 1, username: 'john' },
      workoutProgram: { id: 1, name: 'Upper Split' },
    };

    const updatedWorkoutLinked = {
      ...createdWorkoutLinked,
      code: 'my-first-plan-1',
    };

    mockPrisma.workout.create.mockResolvedValueOnce(createdWorkoutLinked);
    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkoutLinked);

    const resultLinked = await service.create_linked(userId, createWorkoutDto, 1);

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        code: '',
        workoutProgram: { connect: { id: 1 } },
      },
    });

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id: createdWorkoutLinked.id },
      data: { code: 'my-first-plan-1' },
    });

    expect(resultLinked).toEqual(updatedWorkoutLinked);

    const createdWorkout = {
      id: 3,
      userId: 1,
      title: 'My First Plan',
      description: 'A great workout plan',
      code: '',
      user: { id: 1, username: 'john' },
    };

    const updatedWorkout = {
      ...createdWorkout,
      code: 'my-first-plan-3',
    };

    mockPrisma.workout.create.mockResolvedValueOnce(createdWorkout);
    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkout);

    const result = await service.create(userId, createWorkoutDto);

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        code: '',
      },
    });

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id: createdWorkout.id },
      data: { code: 'my-first-plan-3' },
    });

    expect(result).toEqual(updatedWorkout);
  });

  it('should propagate an error if creation fails', async () => {
    const userId = 1;
    const createWorkoutDto: CreateWorkoutDto = {
      title: 'Fail Plan',
      description: 'This will fail',
    };

    const mockError = new Error('Database error');

    mockPrisma.workout.create.mockRejectedValueOnce(mockError);

    await expect(service.create_linked(userId, createWorkoutDto, 1)).rejects.toThrow('Database error');

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        code: '',
        workoutProgram: { connect: { id: 1 } },
      },
    });

    mockPrisma.workout.create.mockRejectedValueOnce(mockError);

    await expect(service.create(userId, createWorkoutDto)).rejects.toThrow('Database error');

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        code: '',
      },
    });
  });

  it('should generate a slug-based code when creating a standalone workout', async () => {
    const userId = 1;
    const createWorkoutDto: CreateWorkoutDto = {
      title: 'Upper 1',
      description: 'Standalone workout',
    };

    const createdWorkout = {
      id: 12,
      userId,
      title: createWorkoutDto.title,
      description: createWorkoutDto.description,
      code: '',
    };

    const updatedWorkout = {
      ...createdWorkout,
      code: 'upper-1-12',
    };

    mockPrisma.workout.create.mockResolvedValueOnce(createdWorkout);
    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkout);

    const result = await service.create(userId, createWorkoutDto);

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id: 12 },
      data: { code: 'upper-1-12' },
    });
    expect(result).toEqual(updatedWorkout);
  });

  it('should generate a fallback code when title slug is empty', async () => {
    const userId = 1;
    const createWorkoutDto: CreateWorkoutDto = {
      title: '!!!',
      description: 'No valid slug characters',
    };

    const createdWorkout = {
      id: 7,
      userId,
      title: createWorkoutDto.title,
      description: createWorkoutDto.description,
      code: '',
    };

    const updatedWorkout = {
      ...createdWorkout,
      code: 'workout-7',
    };

    mockPrisma.workout.create.mockResolvedValueOnce(createdWorkout);
    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkout);

    const result = await service.create(userId, createWorkoutDto);

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { code: 'workout-7' },
    });
    expect(result).toEqual(updatedWorkout);
  });
});

describe('WorkoutService - findAll', () => {
  let service: WorkoutService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workout: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all workout plans with their exercises', async () => {
    // Arrange
    const mockWorkouts = [
      {
        id: 1,
        title: 'Plan 1',
        description: 'First plan',
        workoutExercises: [{ id: 1, name: 'Exercise 1', description: 'desc 1' }],
      },
      {
        id: 2,
        title: 'Plan 2',
        description: 'Second plan',
        workoutExercises: [{ id: 2, name: 'Exercise 2', description: 'desc 2' }],
      },
    ];

    mockPrisma.workout.findMany.mockResolvedValueOnce(mockWorkouts);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.workout.findMany).toHaveBeenCalledWith({
      include: { workoutExercises: true },
    });

    expect(result).toEqual(mockWorkouts);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');

    mockPrisma.workout.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Database error');

    expect(prisma.workout.findMany).toHaveBeenCalledWith({
      include: { workoutExercises: true },
    });
  });
});

describe('WorkoutService - findOne', () => {
  let service: WorkoutService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workout: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a workout plan with exercises when found', async () => {
    // Arrange
    const id = 1;
    const mockWorkout = {
      id: 1,
      title: 'Plan 1',
      description: 'A great workout plan',
      workoutExercises: [
        { id: 1, name: 'Exercise 1', description: 'desc 1' },
        { id: 2, name: 'Exercise 2', description: 'desc 2' }
      ],
    };

    mockPrisma.workout.findUniqueOrThrow.mockResolvedValueOnce(mockWorkout);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.workout.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { workoutExercises: true },
    });
    expect(result).toEqual(mockWorkout);
  });

  it('should throw an error if the workout plan is not found', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Workout plan not found');

    mockPrisma.workout.findUniqueOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Workout plan not found');

    expect(prisma.workout.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { workoutExercises: true },
    });
  });

  it('should propagate a generic error if findUniqueOrThrow fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.workout.findUniqueOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Database error');

    expect(prisma.workout.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { workoutExercises: true },
    });
  });
});

describe('WorkoutService - update', () => {
  let service: WorkoutService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workout: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update a workout plan', async () => {
    // Arrange
    const id = 1;
    const updateWorkoutDto = {
      title: 'Updated Plan',
      description: 'Updated Description',
    };

    const updatedWorkout = {
      id: 1,
      title: 'Updated Plan',
      description: 'Updated Description',
      userId: 1,
    };

    mockPrisma.workout.update.mockResolvedValueOnce(updatedWorkout);

    // Act
    const result = await service.update(id, updateWorkoutDto);

    // Assert
    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutDto,
    });

    expect(result).toEqual(updatedWorkout);
  });

  it('should throw an error if the workout plan to update is not found', async () => {
    // Arrange
    const id = 999;
    const updateWorkoutDto = {
      title: 'Non-existent Plan',
      description: 'Non-existent Description',
    };

    const mockError = new Error('Workout plan not found');
    mockPrisma.workout.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateWorkoutDto)).rejects.toThrow(
      'Workout plan not found',
    );

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutDto,
    });
  });

  it('should propagate a generic error if update fails', async () => {
    // Arrange
    const id = 1;
    const updateWorkoutDto = {
      title: 'Error Plan',
      description: 'This will cause an error',
    };

    const mockError = new Error('Database error');
    mockPrisma.workout.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateWorkoutDto)).rejects.toThrow(
      'Database error',
    );

    expect(prisma.workout.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutDto,
    });
  });
});

describe('WorkoutService - remove', () => {
  let service: WorkoutService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workout: {
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully delete a workout plan', async () => {
    // Arrange
    const id = 1;
    const mockDeletedWorkout = {
      id: 1,
      title: 'Plan 1',
      description: 'A deleted workout plan',
      userId: 1,
    };

    mockPrisma.workout.delete.mockResolvedValueOnce(mockDeletedWorkout);

    // Act
    const result = await service.remove(id);

    // Assert
    expect(prisma.workout.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(mockDeletedWorkout);
  });

  it('should throw an error if the workout plan does not exist', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Workout plan not found');

    mockPrisma.workout.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Workout plan not found');

    expect(prisma.workout.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should propagate a generic error if delete fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.workout.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Database error');

    expect(prisma.workout.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});