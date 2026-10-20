import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { handleErrors } from './handle-errors';

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('Invalid `prisma.workout.update()` invocation in /app/src/x.ts', {
    code,
    clientVersion: '5.22.0',
  });

describe('handleErrors', () => {
  it.each([
    ['P2025', NotFoundException, 'Not found'],
    ['P2003', NotFoundException, 'Not found'],
    ['P2002', ConflictException, 'Already exists'],
  ])('maps %s without leaking the prisma message', (code, Exception, message) => {
    expect(() => handleErrors(prismaError(code))).toThrow(new Exception(message));
  });

  it('hides unknown prisma errors behind a 500', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      handleErrors(prismaError('P9999'));
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
      expect((err as Error).message).not.toContain('/app/src');
    }
    expect.assertions(2);
  });
});
