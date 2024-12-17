import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentials } from '../errors/InvalidCredentials';
import { InvalidTokenType } from '../errors/InvalidTokenType';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

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
              create: jest.fn(),
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
  
  describe('AuthenticationService - signUp', () => {
    let service: AuthenticationService;
    let prismaService: PrismaService;
  
    beforeEach(async () => {
      const mockPrismaService = {
        user: {
          create: jest.fn(), // Mock `create` method
        },
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          {
            provide: PrismaService,
            useValue: mockPrismaService, // Mock PrismaService
          },
          {
            provide: JwtService,
            useValue: {
              signAsync: jest.fn(), // Mock JWT signing
            },
          },
        ],
      }).compile();
  
      service = module.get<AuthenticationService>(AuthenticationService);
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    it('should hash the password, create a user, and generate tokens', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      };
  
      const mockSignUpDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'plainPassword',
      };
  
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
  
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword'); // Mock password hashing
      prismaService.user.create = jest.fn().mockResolvedValueOnce(mockUser); // Mock user creation
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce(mockTokens); // Mock token generation
  
      // Act
      const result = await service.signUp(mockSignUpDto);
  
      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...mockSignUpDto, password: 'hashedPassword' },
      });
      expect(service.generateTokens).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
    });
  });
  
  describe('AuthenticationService - signIn', () => {
    let service: AuthenticationService;
    let prismaService: PrismaService;
  
    beforeEach(async () => {
      const mockPrismaService = {
        user: {
          findFirst: jest.fn(),
        },
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
          {
            provide: JwtService,
            useValue: {
              signAsync: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<AuthenticationService>(AuthenticationService);
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    it('should find the user, validate password, and generate tokens', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      };
  
      const mockCredentials = {
        identification: 'test@example.com',
        password: 'plainPassword',
      };
  
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
  
      prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(mockUser); // Mock user retrieval
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true); // Mock password comparison
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce(mockTokens); // Mock token generation
  
      // Act
      const result = await service.signIn(mockCredentials);
  
      // Assert
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: mockCredentials.identification },
            { username: mockCredentials.identification },
          ],
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password,
      );
      expect(service.generateTokens).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(null); // Mock no user found
  
      const mockCredentials = {
        identification: 'unknown@example.com',
        password: 'plainPassword',
      };
  
      // Act & Assert
      await expect(service.signIn(mockCredentials)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  
    it('should throw InvalidCredentials if password is incorrect', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      };
  
      prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(mockUser); // Mock user retrieval
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false); // Mock password mismatch
  
      const mockCredentials = {
        identification: 'test@example.com',
        password: 'wrongPassword',
      };
  
      // Act & Assert
      await expect(service.signIn(mockCredentials)).rejects.toThrow(
        new InvalidCredentials('Password does not correspond'),
      );
    });
  });
  
  describe('AuthenticationService - refreshTokens', () => {
    let service: AuthenticationService;
    let jwtService: JwtService;
    let prismaService: PrismaService;
  
    beforeEach(async () => {
      const mockPrismaService = {
        user: {
          findUniqueOrThrow: jest.fn(), // Mock user retrieval
        },
        revokedToken: {
          findFirst: jest.fn(), // Mock token revocation check
        },
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          {
            provide: JwtService,
            useValue: {
              decode: jest.fn(),
              verifyAsync: jest.fn(),
            },
          },
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
        ],
      }).compile();
  
      service = module.get<AuthenticationService>(AuthenticationService);
      jwtService = module.get<JwtService>(JwtService);
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    it('should refresh tokens for a valid refresh token', async () => {
      // Arrange
      const mockRefreshToken = 'mock-refresh-token';
      const mockDecodedToken = {
        sub: 1,
        type: 1, // REFRESH token type
        jti: 'mock-jti',
      };
      const mockNewTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
  
      jest.spyOn(jwtService, 'decode').mockReturnValueOnce(mockDecodedToken);
      prismaService.user.findUniqueOrThrow = jest.fn().mockResolvedValueOnce({ id: mockDecodedToken.sub });
      prismaService.revokedToken.findFirst = jest.fn().mockResolvedValueOnce(null); // No revocation
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(null); // Valid token
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce(mockNewTokens);
  
      // Act
      const result = await service.refreshTokens(mockRefreshToken);
  
      // Assert
      expect(jwtService.decode).toHaveBeenCalledWith(mockRefreshToken);
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockDecodedToken.sub } });
      expect(prismaService.revokedToken.findFirst).toHaveBeenCalledWith({ where: { jti: mockDecodedToken.jti } });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken, { secret: process.env.JWT_SECRET });
      expect(service.generateTokens).toHaveBeenCalledWith(mockDecodedToken.sub);
      expect(result).toEqual(mockNewTokens);
    });
  
    it('should throw InvalidTokenType for non-REFRESH tokens', async () => {
      // Arrange
      const mockRefreshToken = 'mock-refresh-token';
      const mockDecodedToken = {
        sub: 1,
        type: 0, // ACCESS token type
        jti: 'mock-jti',
      };
  
      jest.spyOn(jwtService, 'decode').mockReturnValueOnce(mockDecodedToken);
  
      // Act & Assert
      await expect(service.refreshTokens(mockRefreshToken)).rejects.toThrow(InvalidTokenType);
    });
  
    it('should throw InvalidCredentials if the token is revoked', async () => {
      // Arrange
      const mockRefreshToken = 'mock-refresh-token';
      const mockDecodedToken = {
        sub: 1,
        type: 1, // REFRESH token type
        jti: 'mock-jti',
      };
  
      jest.spyOn(jwtService, 'decode').mockReturnValueOnce(mockDecodedToken);
      prismaService.revokedToken.findFirst = jest.fn().mockResolvedValueOnce(true); // Token is revoked
  
      // Act & Assert
      await expect(service.refreshTokens(mockRefreshToken)).rejects.toThrow(InvalidCredentials);
    });
  
    it('should throw NotFoundException if the user does not exist', async () => {
      // Arrange
      const mockRefreshToken = 'mock-refresh-token';
      const mockDecodedToken = {
        sub: 1,
        type: 1, // REFRESH token type
        jti: 'mock-jti',
      };
  
      jest.spyOn(jwtService, 'decode').mockReturnValueOnce(mockDecodedToken);
      prismaService.user.findUniqueOrThrow = jest.fn().mockRejectedValueOnce(new NotFoundException());
  
      // Act & Assert
      await expect(service.refreshTokens(mockRefreshToken)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw an error if the token verification fails', async () => {
      // Arrange
      const mockRefreshToken = 'mock-refresh-token';
      const mockDecodedToken = {
        sub: 1,
        type: 1, // REFRESH token type
        jti: 'mock-jti',
      };
  
      jest.spyOn(jwtService, 'decode').mockReturnValueOnce(mockDecodedToken);
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error('Token verification failed'));
  
      // Act & Assert
      await expect(service.refreshTokens(mockRefreshToken)).rejects.toThrow('Token verification failed');
    });
  });
  
  describe('AuthenticationService - revokeToken', () => {
    let service: AuthenticationService;
    let prismaService: PrismaService;
    let jwtService: JwtService;
  
    beforeEach(async () => {
      const mockPrismaService = {
        user: {
          findUniqueOrThrow: jest.fn(), // Mock user retrieval
        },
        revokedToken: {
          findFirst: jest.fn(), // Mock token revocation check
        },
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          {
            provide: JwtService,
            useValue: {
              decode: jest.fn(),
              verifyAsync: jest.fn(),
            },
          },
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
        ],
      }).compile();
  
      service = module.get<AuthenticationService>(AuthenticationService);
      jwtService = module.get<JwtService>(JwtService);
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    it('should successfully revoke a token', async () => {
      // Arrange
      const mockJti = 'mock-jti';
      const mockRevokedToken = {
        id: 1,
        jti: mockJti,
        createdAt: new Date(),
      };
  
      prismaService.revokedToken.create = jest.fn().mockResolvedValueOnce(mockRevokedToken); // Mock the `create` method
  
      // Act
      const result = await service.revokeToken(mockJti);
  
      // Assert
      expect(prismaService.revokedToken.create).toHaveBeenCalledWith({
        data: { jti: mockJti },
      });
      expect(result).toEqual(mockRevokedToken);
    });
  
    it('should propagate errors from PrismaService', async () => {
      // Arrange
      const mockJti = 'mock-jti';
      const mockError = new Error('Database error');
  
      prismaService.revokedToken.create = jest.fn().mockRejectedValueOnce(mockError);
  
      // Act & Assert
      await expect(service.revokeToken(mockJti)).rejects.toThrow(mockError);
      expect(prismaService.revokedToken.create).toHaveBeenCalledWith({
        data: { jti: mockJti },
      });
    });
  });
});