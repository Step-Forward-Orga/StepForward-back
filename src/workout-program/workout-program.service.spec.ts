import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramService } from './workout-program.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkoutProgramService', () => {
  let service: WorkoutProgramService;
  let prisma: PrismaService;

  const mockPrisma = {
    workoutProgram: {
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
        WorkoutProgramService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutProgramService>(WorkoutProgramService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a workout program', async () => {
    const dto = { title: 'Push Day', description: 'Upper body focus'};
    const userId = 1;
    const created = { id: 1, ...dto, user: { id: userId } };
    mockPrisma.workoutProgram.create.mockResolvedValueOnce(created);

    const result = await service.create(userId, dto);
    expect(prisma.workoutProgram.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        user: { connect: { id: userId } }
      }
    });
    expect(result).toEqual(created);
  });

  it('should return all workout programs', async () => {
    const mockList = [{ id: 1, title: 'Plan A', description: 'Desc', userId: 1 }];
    mockPrisma.workoutProgram.findMany.mockResolvedValueOnce(mockList);

    const result = await service.findAll();
    expect(prisma.workoutProgram.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockList);
  });

  it('should return one workout program', async () => {
    const id = 1;
    const mockItem = { id, title: 'Plan A', description: 'Desc', userId: 1 };
    mockPrisma.workoutProgram.findUniqueOrThrow.mockResolvedValueOnce(mockItem);

    const result = await service.findOne(id);
    expect(prisma.workoutProgram.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: {
        workouts: {
          include: {
            user: true,
          },
        },
        user: true,
        note: true,
      },
    });
    expect(result).toEqual(mockItem);
  });

  it('should update a workout program', async () => {
    const id = 1;
    const dto = { title: 'Updated Plan' };
    const updated = { id, title: 'Updated Plan', description: 'Old desc', userId: 1 };
    mockPrisma.workoutProgram.update.mockResolvedValueOnce(updated);

    const result = await service.update(id, dto);
    expect(prisma.workoutProgram.update).toHaveBeenCalledWith({ where: { id }, data: dto });
    expect(result).toEqual(updated);
  });

  it('should delete a workout program', async () => {
    const id = 1;
    const deleted = { id, title: 'To delete', description: '...', userId: 1 };
    mockPrisma.workoutProgram.delete.mockResolvedValueOnce(deleted);

    const result = await service.remove(id);
    expect(prisma.workoutProgram.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(deleted);
  });
});