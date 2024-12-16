import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';

import { PrismaService } from '../prisma/prisma.service';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(), // Mock signAsync method
          },
        },
        {
          provide: PrismaService, // Mock PrismaService
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn(),
            },
            revokedToken: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate access and refresh tokens', async () => {
    const mockSub = 1;
    const mockAccessToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';
    const mockRefreshJti = uuid.v4();

    jest.spyOn(uuid, 'v4').mockReturnValueOnce(mockRefreshJti as any); // Mock uuid for refreshJti

    jest.spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(mockAccessToken) // First call returns accessToken
      .mockResolvedValueOnce(mockRefreshToken); // Second call returns refreshToken

    // Act
    const tokens = await service.generateTokens(mockSub);

    // Assert
    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

    // Check accessToken
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        type: 0,
        refreshJti: mockRefreshJti,
        sub: mockSub,
      },
      {
        jwtid: expect.any(String),
        expiresIn: '2h',
      },
    );

    // Check refreshToken
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        type: 1,
        expiresIn: '20d',
        sub: mockSub,
      },
      {
        jwtid: mockRefreshJti,
      },
    );

    // Validate the returned tokens
    expect(tokens).toEqual({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  });
});