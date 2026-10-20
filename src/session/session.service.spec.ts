import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  const prisma = {
    workout: { findFirstOrThrow: jest.fn() },
    workoutSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    sessionExercise: { create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
    loggedSet: { create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  describe('start', () => {
    it('copies the owned workout exercises in order', async () => {
      prisma.workout.findFirstOrThrow.mockResolvedValueOnce({
        id: 3,
        title: 'Upper 1',
        workoutExercises: [
          { id: 10, exerciseId: 20 },
          { id: 11, exerciseId: 14 },
        ],
      });

      await service.start(1, { workoutId: 3 });

      expect(prisma.workout.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 3, userId: 1 },
        include: { workoutExercises: { orderBy: { order: 'asc' } } },
      });
      expect(prisma.workoutSession.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          workoutId: 3,
          title: 'Upper 1',
          exercises: {
            create: [
              { order: 1, exerciseId: 20, workoutExerciseId: 10 },
              { order: 2, exerciseId: 14, workoutExerciseId: 11 },
            ],
          },
        },
        include: expect.objectContaining({ exercises: expect.any(Object) }),
      });
    });

    it('starts an empty session without a template', async () => {
      await service.start(1, {});

      expect(prisma.workout.findFirstOrThrow).not.toHaveBeenCalled();
      expect(prisma.workoutSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 1, workoutId: undefined, title: 'Workout', exercises: { create: [] } },
        }),
      );
    });

    it('keeps a custom title', async () => {
      prisma.workout.findFirstOrThrow.mockResolvedValueOnce({ id: 3, title: 'Upper 1', workoutExercises: [] });

      await service.start(1, { workoutId: 3, title: 'Upper 1 (deload)' });

      expect(prisma.workoutSession.create.mock.calls[0][0].data.title).toBe('Upper 1 (deload)');
    });
  });

  it('lists the user sessions', async () => {
    await service.findAll(1, { workoutId: 3, include: ['exercises'], sortBy: 'startedAt' });

    expect(prisma.workoutSession.findMany).toHaveBeenCalledWith({
      where: { userId: 1, workoutId: 3 },
      include: { exercises: true },
      skip: 0,
      take: 10,
      orderBy: { startedAt: 'desc' },
    });
  });

  it('scopes find/update/remove of a session to its owner', async () => {
    await service.findOne(5, 1);
    await service.update(5, 1, { note: 'n', finishedAt: '2026-10-20T10:00:00.000Z' });
    await service.remove(5, 1);

    expect(prisma.workoutSession.findFirstOrThrow).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 5, userId: 1 } }));
    expect(prisma.workoutSession.update).toHaveBeenCalledWith({
      where: { id: 5, userId: 1 },
      data: { note: 'n', finishedAt: '2026-10-20T10:00:00.000Z' },
    });
    expect(prisma.workoutSession.delete).toHaveBeenCalledWith({ where: { id: 5, userId: 1 } });
  });

  describe('session exercises', () => {
    it('appends an exercise to an owned session', async () => {
      prisma.sessionExercise.count.mockResolvedValueOnce(2);

      await service.addExercise(5, 1, { exerciseId: 7, note: 'n' });

      expect(prisma.sessionExercise.create).toHaveBeenCalledWith({
        data: {
          order: 3,
          note: 'n',
          session: { connect: { id: 5, userId: 1 } },
          exercise: { connect: { id: 7, OR: [{ userId: null }, { userId: 1 }] } },
        },
        include: { exercise: true, sets: true },
      });
    });

    it('uses the given order without counting', async () => {
      await service.addExercise(5, 1, { exerciseId: 7, order: 1 });

      expect(prisma.sessionExercise.count).not.toHaveBeenCalled();
      expect(prisma.sessionExercise.create.mock.calls[0][0].data.order).toBe(1);
    });

    it('scopes update/remove to the session owner', async () => {
      await service.updateExercise(9, 1, { note: 'x' });
      await service.removeExercise(9, 1);

      expect(prisma.sessionExercise.update).toHaveBeenCalledWith({ where: { id: 9, session: { userId: 1 } }, data: { note: 'x' } });
      expect(prisma.sessionExercise.delete).toHaveBeenCalledWith({ where: { id: 9, session: { userId: 1 } } });
    });
  });

  describe('logged sets', () => {
    it('logs the next set on an owned session exercise', async () => {
      prisma.loggedSet.count.mockResolvedValueOnce(1);

      await service.logSet(9, 1, { reps: 8, weight: 80, note: 'top set' });

      expect(prisma.loggedSet.create).toHaveBeenCalledWith({
        data: {
          reps: 8,
          weight: 80,
          note: 'top set',
          order: 2,
          sessionExercise: { connect: { id: 9, session: { userId: 1 } } },
        },
      });
    });

    it('keeps an explicit order', async () => {
      await service.logSet(9, 1, { reps: 8, weight: 80, order: 4 });

      expect(prisma.loggedSet.count).not.toHaveBeenCalled();
      expect(prisma.loggedSet.create.mock.calls[0][0].data.order).toBe(4);
    });

    it('scopes update/remove to the session owner', async () => {
      await service.updateSet(12, 1, { reps: 9 });
      await service.removeSet(12, 1);

      const where = { id: 12, sessionExercise: { session: { userId: 1 } } };
      expect(prisma.loggedSet.update).toHaveBeenCalledWith({ where, data: { reps: 9 } });
      expect(prisma.loggedSet.delete).toHaveBeenCalledWith({ where });
    });
  });
});
