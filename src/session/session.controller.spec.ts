import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { SessionController } from './session.controller';
import { SessionService } from './session.service';

describe('SessionController', () => {
  const user = { sub: 1 } as any;
  const service = {
    start: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addExercise: jest.fn(),
    updateExercise: jest.fn(),
    removeExercise: jest.fn(),
    logSet: jest.fn(),
    updateSet: jest.fn(),
    removeSet: jest.fn(),
  };
  const controller = new SessionController(service as unknown as SessionService);

  beforeEach(() => jest.resetAllMocks());

  it.each([
    ['start', () => controller.start(user, { workoutId: 3 }), [1, { workoutId: 3 }]],
    ['findAll', () => controller.findAll(user, {}), [1, {}]],
    ['findOne', () => controller.findOne(user, 5), [5, 1]],
    ['update', () => controller.update(user, 5, { note: 'n' }), [5, 1, { note: 'n' }]],
    ['remove', () => controller.remove(user, 5), [5, 1]],
    ['addExercise', () => controller.addExercise(user, 5, { exerciseId: 7 }), [5, 1, { exerciseId: 7 }]],
    ['updateExercise', () => controller.updateExercise(user, 9, { note: 'x' }), [9, 1, { note: 'x' }]],
    ['removeExercise', () => controller.removeExercise(user, 9), [9, 1]],
    ['logSet', () => controller.logSet(user, 9, { reps: 8, weight: 80 }), [9, 1, { reps: 8, weight: 80 }]],
    ['updateSet', () => controller.updateSet(user, 12, { reps: 9 }), [12, 1, { reps: 9 }]],
    ['removeSet', () => controller.removeSet(user, 12), [12, 1]],
  ] as const)('%s passes the user id to the service', async (method, call, args) => {
    service[method].mockResolvedValueOnce({ ok: true });

    await expect(call()).resolves.toEqual({ ok: true });
    expect(service[method]).toHaveBeenCalledWith(...args);
  });

  it('maps a not-owned record to a 404', async () => {
    service.findOne.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('not found', { code: 'P2025', clientVersion: '5.22.0' }),
    );

    await expect(controller.findOne(user, 5)).rejects.toThrow(NotFoundException);
  });
});
