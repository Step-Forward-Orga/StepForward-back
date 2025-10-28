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

  it('should successfully create a workout plan', async () => {
    const userId = 1;
    const CreateWorkoutDto: CreateWorkoutDto = {
      title: 'My First Plan',
      description: 'A great workout plan',
    };

    let mockWorkout_linked = {
      id: 1,
      userId: 1,
      title: 'My First Plan',
      description: 'A great workout plan',
      user: { id: 1, username: 'john' }, // simplified user
      workoutProgram: { id: 1, name: 'Upper Split' }, // if needed
    };

    // test create with workoutProgram
    mockPrisma.workout.create.mockResolvedValueOnce(mockWorkout_linked);

    // Act
    const result_linked = await service.create_linked(userId, CreateWorkoutDto, 1);

    // Assert
    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: CreateWorkoutDto.title,
        description: CreateWorkoutDto.description,
        workoutProgram: { connect: { id: 1 } },
      },
    });
    expect(result_linked).toEqual(mockWorkout_linked);

    // modify object to test create without workoutProgram
    delete mockWorkout_linked.workoutProgram

    mockPrisma.workout.create.mockResolvedValueOnce(mockWorkout_linked); // ← this is the missing part
    const result = await service.create(userId, CreateWorkoutDto);

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: CreateWorkoutDto.title,
        description: CreateWorkoutDto.description,
      },
    });

    expect(result).toEqual(mockWorkout_linked);
  });

  it('should propagate an error if creation fails', async () => {
    // Arrange
    const userId = 1;
    const CreateWorkoutDto: CreateWorkoutDto = {
      title: 'Fail Plan',
      description: 'This will fail',
    };

    const mockError = new Error('Database error');

    mockPrisma.workout.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create_linked(userId, CreateWorkoutDto, 1)).rejects.toThrow(
      'Database error',
    );

    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: CreateWorkoutDto.title,
        description: CreateWorkoutDto.description,
        workoutProgram: { connect: { id: 1 } },
      },
    });

    mockPrisma.workout.create.mockRejectedValueOnce(mockError);

    await expect(service.create(userId, CreateWorkoutDto)).rejects.toThrow(
      'Database error',
    );
    expect(prisma.workout.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: userId } },
        title: CreateWorkoutDto.title,
        description: CreateWorkoutDto.description,
      },
    });
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
        exercises: [{ id: 1, name: 'Exercise 1' }],
      },
      {
        id: 2,
        title: 'Plan 2',
        description: 'Second plan',
        exercises: [{ id: 2, name: 'Exercise 2' }],
      },
    ];

    mockPrisma.workout.findMany.mockResolvedValueOnce(mockWorkouts);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.workout.findMany).toHaveBeenCalledWith({
      include: { exercises: true },
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
      include: { exercises: true },
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
      exercises: [
        { id: 1, name: 'Exercise 1' },
        { id: 2, name: 'Exercise 2' },
      ],
    };

    mockPrisma.workout.findUniqueOrThrow.mockResolvedValueOnce(mockWorkout);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.workout.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { exercises: true },
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
      include: { exercises: true },
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
      include: { exercises: true },
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