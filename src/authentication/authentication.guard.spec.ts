import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

import { AuthGuard } from './authentication.guard';

describe('AuthGuard', () => {
  const payload = { sub: 1, jti: 'jti-1' };
  const jwtService = { verifyAsync: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() }, revokedToken: { findUnique: jest.fn() } };
  const reflector = { get: jest.fn() };
  const guard = new AuthGuard(jwtService as any, prisma as any, reflector as any);

  const contextFor = (request: any) =>
    ({ switchToHttp: () => ({ getRequest: () => request }), getHandler: () => undefined }) as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jwtService.verifyAsync.mockResolvedValue(payload);
    prisma.user.findUnique.mockResolvedValue({ roles: [Role.USER] });
    prisma.revokedToken.findUnique.mockResolvedValue(null);
  });

  it('sets request.user with the roles array from the database', async () => {
    const request: any = { cookies: { jwt: 'token' } };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request.user).toEqual({ ...payload, roles: [Role.USER] });
  });

  it('rejects a request without a token', async () => {
    await expect(guard.canActivate(contextFor({ cookies: {} }))).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a revoked token', async () => {
    prisma.revokedToken.findUnique.mockResolvedValue({ jti: 'jti-1' });

    await expect(guard.canActivate(contextFor({ cookies: { jwt: 'token' } }))).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a user missing a required role', async () => {
    reflector.get.mockReturnValue([Role.ADMIN]);

    await expect(guard.canActivate(contextFor({ cookies: { jwt: 'token' } }))).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a token whose user no longer exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(guard.canActivate(contextFor({ cookies: { jwt: 'token' } }))).rejects.toThrow(UnauthorizedException);
  });
});
