import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutExerciseService } from './workout-exercise.service';
import { PrismaService } from '../prisma/prisma.service';
import { SetsDto } from './dto/sets.dot';

const setPlannedMock1: SetsDto = {
  reps: 8,
  weight: 100,
  order: 1,
  type: "PLANNED"
}

const setPlannedMock2: SetsDto = {
  reps: 6,
  weight: 100,
  order: 2,
  type: "PLANNED"
}

const setPlannedMock3: SetsDto = {
  reps: 10,
  weight: 75,
  order: 3,
  type: "PLANNED"
}


const setCompletedMock1: SetsDto = {
  reps: 7,
  weight: 100,
  order: 1,
  type: "COMPLETED"
}

const setCompletedMock2: SetsDto = {
  reps: 6,
  weight: 100,
  order: 2,
  type: "COMPLETED"
}

const setCompletedMock3: SetsDto = {
  reps: 9,
  weight: 75,
  order: 3,
  type: "COMPLETED"
}
describe('WorkoutExerciseService', () => {
  let service: WorkoutExerciseService;
    let prisma: PrismaService;
  
    const mockPrisma = {
      workoutExercise: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          WorkoutExerciseService,
          { provide: PrismaService, useValue: mockPrisma },
        ],
      }).compile();
  
      service = module.get<WorkoutExerciseService>(WorkoutExerciseService);
      prisma = module.get<PrismaService>(PrismaService);
    });

  it('should successfully create a new workout exercise', async () => {
    const dto = { 
      exerciseId: 1,
      plannedSets: [
        setPlannedMock1,
        setPlannedMock2,
        setPlannedMock3
      ],
      restTime: "PTM3M",
      completed: false,
      workoutId: 1
    };

    const created = { 
      id: 1,
      exerciseId: dto.exerciseId,
      plannedSets: dto.plannedSets,
      restTime: dto.restTime,
      completed: dto.completed,
    };

    mockPrisma.workoutExercise.create.mockResolvedValueOnce(created);

    const result = await service.create(dto);

    expect(prisma.workoutExercise.create).toHaveBeenCalledWith({
      data: {
        exerciseId: dto.exerciseId,
        restTime: dto.restTime,
        completed: dto.completed,
        workoutId: dto.workoutId,
        plannedSets: { 
          create: dto.plannedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type,
          })),
        },
      },
      include: {
        plannedSets: true
      }
    });
    expect(result).toEqual(created);
  });

  it ("should return all workout-exercises", async () => {
    const mockList = [
      {
        id: 1,
        exerciseId: 1,
        plannedSets: [setPlannedMock1, setPlannedMock2],
        completedSets: [setCompletedMock1],
        restTime: 'PTM3M',
        completed: false,
        workoutId: 1,
      },
      {
        id: 2,
        exerciseId: 2,
        plannedSets: [setPlannedMock3],
        completedSets: [setCompletedMock2, setCompletedMock3],
        restTime: 'PTM2M',
        completed: true,
        workoutId: 1,
      },
    ];

    mockPrisma.workoutExercise.findMany.mockResolvedValueOnce(mockList);

    const result = await service.findAll();

    expect(prisma.workoutExercise.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockList);
  });

  it('should mark a workout-exercise as completed with completed sets', async () => {
    const completeDto = {
      completed: true,
      completedSets: [
        setCompletedMock1,
        setCompletedMock2,
        setCompletedMock3,
      ],
    };

    const updatedExercise = {
      id: 1,
      completed: true,
      completedSets: completeDto.completedSets,
      completedAt: expect.any(Date),
    };

    mockPrisma.workoutExercise.update = jest.fn().mockResolvedValue(updatedExercise);

    const result = await service.complete(1, completeDto);

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        completed: completeDto.completed,
        completedSets: {
          create: completeDto.completedSets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type,
          })),
        },
        completedAt: expect.any(Date),
      },
      include: {
        completedSets: true,
        plannedSets: true
      }
    });

    expect(result).toEqual(updatedExercise);
  });

    it('should return one workout-exercise by id', async () => {
    const mockWorkoutExercise = {
      id: 1,
      exerciseId: 1,
      plannedSets: [setPlannedMock1, setPlannedMock2],
      completedSets: [setCompletedMock1],
      restTime: 'PTM3M',
      completed: false,
      workoutId: 1,
    };

    mockPrisma.workoutExercise.findUniqueOrThrow.mockResolvedValueOnce(mockWorkoutExercise);

    const result = await service.findOne(1);

    expect(prisma.workoutExercise.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockWorkoutExercise);
  });

  it('should complete a workout-exercise', async () => {
    const completeDto = {
      completed: true,
      completedSets: [setCompletedMock1, setCompletedMock2, setCompletedMock3],
    };

    const completedWorkoutExercise = {
      id: 1,
      exerciseId: 1,
      plannedSets: [setPlannedMock1, setPlannedMock2],
      completedSets: completeDto.completedSets,
      restTime: 'PTM3M',
      completed: true,
      workoutId: 1,
      completedAt: expect.any(Date),
    };

    mockPrisma.workoutExercise.update.mockResolvedValueOnce(completedWorkoutExercise);

    const result = await service.complete(1, completeDto as any);

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        completed: completeDto.completed,
        completedSets: {
          create: completeDto.completedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type,
          })),
        },
        completedAt: expect.any(Date),
      },
      include: {
        completedSets: true,
        plannedSets: true,
      },
    });
    expect(result).toEqual(completedWorkoutExercise);
  });

  it('should update a workout-exercise with plannedSets', async () => {
    const updateDto = {
      restTime: 'PTM5M',
      completed: true,
      plannedSets: [setPlannedMock1, setPlannedMock3],
      workoutId: 99,
    };

    const updatedWorkoutExercise = {
      id: 1,
      exerciseId: 1,
      plannedSets: updateDto.plannedSets,
      restTime: updateDto.restTime,
      completed: updateDto.completed,
      workoutId: 1,
    };

    mockPrisma.workoutExercise.update.mockResolvedValueOnce(updatedWorkoutExercise);

    const result = await service.update(1, updateDto as any);

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        restTime: updateDto.restTime,
        completed: updateDto.completed,
        plannedSets: {
          set: updateDto.plannedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type,
          })),
        },
      },
    });
    expect(result).toEqual(updatedWorkoutExercise);
  });

  it('should update a workout-exercise without plannedSets', async () => {
    const updateDto = {
      restTime: 'PTM1M',
      completed: false,
      workoutId: 123,
    };

    const updatedWorkoutExercise = {
      id: 1,
      exerciseId: 1,
      plannedSets: [setPlannedMock1],
      restTime: updateDto.restTime,
      completed: updateDto.completed,
      workoutId: 1,
    };

    mockPrisma.workoutExercise.update.mockResolvedValueOnce(updatedWorkoutExercise);

    const result = await service.update(1, updateDto as any);

    expect(prisma.workoutExercise.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        restTime: updateDto.restTime,
        completed: updateDto.completed,
      },
    });
    expect(result).toEqual(updatedWorkoutExercise);
  });

  it('should remove a workout-exercise', async () => {
    const deletedWorkoutExercise = {
      id: 1,
      exerciseId: 1,
      plannedSets: [setPlannedMock1],
      completedSets: [],
      restTime: 'PTM3M',
      completed: false,
      workoutId: 1,
    };

    mockPrisma.workoutExercise.delete.mockResolvedValueOnce(deletedWorkoutExercise);

    const result = await service.remove(1);

    expect(prisma.workoutExercise.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(deletedWorkoutExercise);
  });
});
