import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { WorkoutPlanService } from './workout-plan.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';

describe('WorkoutPlanService - create', () => {
  let service: WorkoutPlanService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workoutPlan: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutPlanService>(WorkoutPlanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully create a workout plan', async () => {
    // Arrange
    const userId = 1;
    const createWorkoutPlanDto: CreateWorkoutPlanDto = {
      title: 'My First Plan',
      description: 'A great workout plan',
    };

    const mockWorkoutPlan = {
      id: 1,
      userId: 1,
      title: 'My First Plan',
      description: 'A great workout plan',
    };

    mockPrisma.workoutPlan.create.mockResolvedValueOnce(mockWorkoutPlan);

    // Act
    const result = await service.create(userId, createWorkoutPlanDto);

    // Assert
    expect(prisma.workoutPlan.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: createWorkoutPlanDto.title,
        description: createWorkoutPlanDto.description,
      },
    });

    expect(result).toEqual(mockWorkoutPlan);
  });

  it('should propagate an error if creation fails', async () => {
    // Arrange
    const userId = 1;
    const createWorkoutPlanDto: CreateWorkoutPlanDto = {
      title: 'Fail Plan',
      description: 'This will fail',
    };

    const mockError = new Error('Database error');

    mockPrisma.workoutPlan.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(userId, createWorkoutPlanDto)).rejects.toThrow(
      'Database error',
    );

    expect(prisma.workoutPlan.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: createWorkoutPlanDto.title,
        description: createWorkoutPlanDto.description,
      },
    });
  });
});

describe('WorkoutPlanService - findAll', () => {
  let service: WorkoutPlanService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workoutPlan: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutPlanService>(WorkoutPlanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all workout plans with their exercises', async () => {
    // Arrange
    const mockWorkoutPlans = [
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

    mockPrisma.workoutPlan.findMany.mockResolvedValueOnce(mockWorkoutPlans);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.workoutPlan.findMany).toHaveBeenCalledWith({
      include: { exercises: true },
    });

    expect(result).toEqual(mockWorkoutPlans);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');

    mockPrisma.workoutPlan.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Database error');

    expect(prisma.workoutPlan.findMany).toHaveBeenCalledWith({
      include: { exercises: true },
    });
  });
});

describe('WorkoutPlanService - findOne', () => {
  let service: WorkoutPlanService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workoutPlan: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutPlanService>(WorkoutPlanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a workout plan with exercises when found', async () => {
    // Arrange
    const id = 1;
    const mockWorkoutPlan = {
      id: 1,
      title: 'Plan 1',
      description: 'A great workout plan',
      exercises: [
        { id: 1, name: 'Exercise 1' },
        { id: 2, name: 'Exercise 2' },
      ],
    };

    mockPrisma.workoutPlan.findUniqueOrThrow.mockResolvedValueOnce(mockWorkoutPlan);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.workoutPlan.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { exercises: true },
    });
    expect(result).toEqual(mockWorkoutPlan);
  });

  it('should throw an error if the workout plan is not found', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Workout plan not found');

    mockPrisma.workoutPlan.findUniqueOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Workout plan not found');

    expect(prisma.workoutPlan.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { exercises: true },
    });
  });

  it('should propagate a generic error if findUniqueOrThrow fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.workoutPlan.findUniqueOrThrow.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Database error');

    expect(prisma.workoutPlan.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: { exercises: true },
    });
  });
});

describe('WorkoutPlanService - update', () => {
  let service: WorkoutPlanService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workoutPlan: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutPlanService>(WorkoutPlanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update a workout plan', async () => {
    // Arrange
    const id = 1;
    const updateWorkoutPlanDto = {
      title: 'Updated Plan',
      description: 'Updated Description',
    };

    const updatedWorkoutPlan = {
      id: 1,
      title: 'Updated Plan',
      description: 'Updated Description',
      userId: 1,
    };

    mockPrisma.workoutPlan.update.mockResolvedValueOnce(updatedWorkoutPlan);

    // Act
    const result = await service.update(id, updateWorkoutPlanDto);

    // Assert
    expect(prisma.workoutPlan.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutPlanDto,
    });

    expect(result).toEqual(updatedWorkoutPlan);
  });

  it('should throw an error if the workout plan to update is not found', async () => {
    // Arrange
    const id = 999;
    const updateWorkoutPlanDto = {
      title: 'Non-existent Plan',
      description: 'Non-existent Description',
    };

    const mockError = new Error('Workout plan not found');
    mockPrisma.workoutPlan.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateWorkoutPlanDto)).rejects.toThrow(
      'Workout plan not found',
    );

    expect(prisma.workoutPlan.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutPlanDto,
    });
  });

  it('should propagate a generic error if update fails', async () => {
    // Arrange
    const id = 1;
    const updateWorkoutPlanDto = {
      title: 'Error Plan',
      description: 'This will cause an error',
    };

    const mockError = new Error('Database error');
    mockPrisma.workoutPlan.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateWorkoutPlanDto)).rejects.toThrow(
      'Database error',
    );

    expect(prisma.workoutPlan.update).toHaveBeenCalledWith({
      where: { id },
      data: updateWorkoutPlanDto,
    });
  });
});

describe('WorkoutPlanService - remove', () => {
  let service: WorkoutPlanService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    workoutPlan: {
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutPlanService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutPlanService>(WorkoutPlanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully delete a workout plan', async () => {
    // Arrange
    const id = 1;
    const mockDeletedWorkoutPlan = {
      id: 1,
      title: 'Plan 1',
      description: 'A deleted workout plan',
      userId: 1,
    };

    mockPrisma.workoutPlan.delete.mockResolvedValueOnce(mockDeletedWorkoutPlan);

    // Act
    const result = await service.remove(id);

    // Assert
    expect(prisma.workoutPlan.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(mockDeletedWorkoutPlan);
  });

  it('should throw an error if the workout plan does not exist', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Workout plan not found');

    mockPrisma.workoutPlan.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Workout plan not found');

    expect(prisma.workoutPlan.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should propagate a generic error if delete fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.workoutPlan.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Database error');

    expect(prisma.workoutPlan.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});