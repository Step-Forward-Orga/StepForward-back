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
      findFirstOrThrow: jest.fn(),
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

    const result = await service.findAll(1, { search: 'plan', page: 2, limit: 5, include: ['workouts', 'user'] });
    expect(prisma.workoutProgram.findMany).toHaveBeenCalledWith({
      where: {
        userId: 1,
        OR: [
          { title: { contains: 'plan', mode: 'insensitive' } },
          { description: { contains: 'plan', mode: 'insensitive' } },
        ],
      },
      include: { workouts: true },
      skip: 5,
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(mockList);
  });

  it('should return one workout program', async () => {
    const id = 1;
    const mockItem = { id, title: 'Plan A', description: 'Desc', userId: 1 };
    mockPrisma.workoutProgram.findFirstOrThrow.mockResolvedValueOnce(mockItem);

    const result = await service.findOne(id, 1, ['note']);
    expect(prisma.workoutProgram.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id, userId: 1 },
      include: { note: true },
    });
    expect(result).toEqual(mockItem);
  });

  it('should update a workout program', async () => {
    const id = 1;
    const dto = { title: 'Updated Plan' };
    const updated = { id, title: 'Updated Plan', description: 'Old desc', userId: 1 };
    mockPrisma.workoutProgram.update.mockResolvedValueOnce(updated);

    const result = await service.update(id, 1, dto);
    expect(prisma.workoutProgram.update).toHaveBeenCalledWith({ where: { id, userId: 1 }, data: dto });
    expect(result).toEqual(updated);
  });

  it('should delete a workout program', async () => {
    const id = 1;
    const deleted = { id, title: 'To delete', description: '...', userId: 1 };
    mockPrisma.workoutProgram.delete.mockResolvedValueOnce(deleted);

    const result = await service.remove(id, 1);
    expect(prisma.workoutProgram.delete).toHaveBeenCalledWith({ where: { id, userId: 1 } });
    expect(result).toEqual(deleted);
  });
});