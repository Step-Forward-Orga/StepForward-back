import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { UserEntity } from '../user/entities/user.entity';
import { InvalidCredentials } from '../errors/InvalidCredentials';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in-dto';
import { JwtPayload } from './contracts/JwtPayload.interface';
import { JwtType } from './enums/JwtType.enum';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthenticationService;

  const mockAuthService = {
    signUp: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(), // Properly mock user.create
    },
  };

  const mockResponse: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService, // Mock AuthenticationService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Mock PrismaService properly
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          }
        },
        Reflector, // Reflector is required for guards
        {
          provide: APP_GUARD,
          useClass: AuthGuard, // Use a mocked AuthGuard
        },
      ]
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('signUp', () => {
    it('should successfully sign up a user and set cookies', async () => {
      // Arrange
      const mockSignUpDto: SignUpDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };

      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      mockAuthService.signUp.mockResolvedValueOnce({
        user: mockUser,
        tokens: mockTokens,
      });

      // Act
      const result = await controller.signUp(mockSignUpDto, mockResponse as Response);

      // Assert
      expect(authService.signUp).toHaveBeenCalledWith(mockSignUpDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.objectContaining({ httpOnly: true, secure: true, path: '/authentication/refresh-token' }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        mockTokens.accessToken,
        expect.objectContaining({ httpOnly: true, secure: true, path: '/' }),
      );
      expect(result).toEqual(new UserEntity(mockUser));
    });

    it('should handle errors thrown by the service', async () => {
      // Arrange
      const mockSignUpDto: SignUpDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      mockAuthService.signUp.mockRejectedValueOnce(new ConflictException('User already exists'));

      // Act & Assert
      await expect(
        controller.signUp(mockSignUpDto, mockResponse as Response),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('AuthenticationController - signIn', () => {
    let controller: AuthenticationController;
    let authService: AuthenticationService;
  
    const mockAuthService = {
      signIn: jest.fn(),
    };
  
    const mockResponse: Partial<Response> = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthenticationController],
        providers: [
          {
            provide: AuthenticationService,
            useValue: mockAuthService,
          },
          {
            provide: PrismaService,
            useValue: {}, // Mocked PrismaService
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(),
              verify: jest.fn(),
              decode: jest.fn(),
            }
          },
          Reflector, // Reflector is required for guards
          {
            provide: APP_GUARD,
            useClass: AuthGuard, // Use a mocked AuthGuard
          },
        ],
      }).compile();
  
      controller = module.get<AuthenticationController>(AuthenticationController);
      authService = module.get<AuthenticationService>(AuthenticationService);
    });
  
    it('should successfully sign in a user and set cookies', async () => {
      // Arrange
      const mockSignInDto: SignInDto = {
        identification: 'test@example.com',
        password: 'Password123!',
      };
  
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
  
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };
  
      mockAuthService.signIn.mockResolvedValueOnce({
        user: mockUser,
        tokens: mockTokens,
      });
  
      // Act
      const result = await controller.signIn(mockSignInDto, mockResponse as Response);
  
      // Assert
      expect(authService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          path: '/authentication/refresh-token',
          sameSite: 'none',
        }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        mockTokens.accessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'none',
        }),
      );
      expect(result).toEqual(new UserEntity(mockUser));
    });
  
    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Arrange
      const mockSignInDto: SignInDto = {
        identification: 'wrong@example.com',
        password: 'WrongPassword',
      };
  
      mockAuthService.signIn.mockRejectedValueOnce(new UnauthorizedException('Invalid credentials'));
  
      // Act & Assert
      await expect(
        controller.signIn(mockSignInDto, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
    });
  
    it('should handle generic errors and throw InternalServerErrorException', async () => {
      // Arrange
      const mockSignInDto: SignInDto = {
        identification: 'test@example.com',
        password: 'Password123!',
      };
  
      const mockError = new Error('Database connection failed');
      mockAuthService.signIn.mockRejectedValueOnce(mockError);
  
      // Act & Assert
      await expect(
        controller.signIn(mockSignInDto, mockResponse as Response),
      ).rejects.toThrow();
    });
  });

  describe('AuthenticationController - refreshToken', () => {
    let controller: AuthenticationController;
    let authService: AuthenticationService;
  
    const mockAuthService = {
      refreshTokens: jest.fn(),
    };
  
    const mockResponse: Partial<Response> = {
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  
    const mockRequest: Partial<Request> = {
      cookies: {},
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthenticationController],
        providers: [
          {
            provide: AuthenticationService,
            useValue: mockAuthService,
          },
          {
            provide: PrismaService,
            useValue: {},
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(),
              verify: jest.fn(),
              decode: jest.fn(),
            }
          },
          Reflector, // Reflector is required for guards
          {
            provide: APP_GUARD,
            useClass: AuthGuard, // Use a mocked AuthGuard
          },
        ],
      }).compile();
  
      controller = module.get<AuthenticationController>(AuthenticationController);
      authService = module.get<AuthenticationService>(AuthenticationService);
    });
  
    it('should successfully refresh the access token and set the jwt cookie', async () => {
      // Arrange
      mockRequest.cookies['refreshToken'] = 'valid-refresh-token';
  
      const mockNewAccessToken = 'new-access-token';
      mockAuthService.refreshTokens.mockResolvedValueOnce({
        accessToken: mockNewAccessToken,
      });
  
      // Act
      await controller.refreshToken(
        mockRequest as Request,
        mockResponse as Response,
      );
  
      // Assert
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockRequest.cookies['refreshToken'],
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        mockNewAccessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'none',
        }),
      );
    });
  
    it('should throw InvalidCredentials if refreshToken cookie is missing', async () => {
      // Arrange: Missing refreshToken cookie
      mockRequest.cookies = {};
  
      // Act & Assert
      await expect(
        controller.refreshToken(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
    });
  
    it('should clear cookies and handle InvalidCredentials if the refresh token is invalid', async () => {
      // Arrange
      mockRequest.cookies['refreshToken'] = 'invalid-refresh-token';
      mockAuthService.refreshTokens.mockRejectedValueOnce(new InvalidCredentials());
  
      // Act & Assert
      await expect(
        controller.refreshToken(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
  
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/authentication/refresh-token',
      });
    });
  });

  describe('AuthenticationController - revokeToken', () => {
    let controller: AuthenticationController;
    let authService: AuthenticationService;
  
    const mockAuthService = {
      revokeToken: jest.fn(),
    };
  
    const mockResponse: Partial<Response> = {
      clearCookie: jest.fn().mockReturnThis(),
    };
  
    const mockUser: JwtPayload = {
      sub: 1,
      jti: 'jti-token',
      refreshJti: 'refresh-jti-token',
      exp: 0,
      iat: 0,
      type: JwtType.ACCESS
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthenticationController],
        providers: [
          {
            provide: AuthenticationService,
            useValue: mockAuthService,
          },
          {
            provide: PrismaService,
            useValue: {}, // Mocked PrismaService
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(),
              verify: jest.fn(),
              decode: jest.fn(),
            }
          },
          Reflector, // Reflector is required for guards
          {
            provide: APP_GUARD,
            useClass: AuthGuard, // Use a mocked AuthGuard
          },
        ],
      }).compile();
  
      controller = module.get<AuthenticationController>(AuthenticationController);
      authService = module.get<AuthenticationService>(AuthenticationService);
    });
  
    it('should revoke tokens and clear cookies successfully', async () => {
      // Arrange
      mockAuthService.revokeToken.mockResolvedValueOnce('revoked-jti');
      mockAuthService.revokeToken.mockResolvedValueOnce('revoked-refresh-jti');
  
      // Act
      const result = await controller.revokeToken(mockUser, mockResponse as Response);
  
      // Assert
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.jti);
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.refreshJti);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/authentication/refresh-token',
      });
  
      expect(result).toEqual(['revoked-jti', 'revoked-refresh-jti']);
    });
  
    it('should revoke only jti if refreshJti is null', async () => {
      // Arrange
      const mockUserWithoutRefresh = { ...mockUser, refreshJti: null };
  
      mockAuthService.revokeToken.mockResolvedValueOnce('revoked-jti');
  
      // Act
      const result = await controller.revokeToken(mockUserWithoutRefresh, mockResponse as Response);
  
      // Assert
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUserWithoutRefresh.jti);
      expect(authService.revokeToken).not.toHaveBeenCalledWith(mockUserWithoutRefresh.refreshJti);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/authentication/refresh-token',
      });
  
      expect(result).toEqual(['revoked-jti', null]);
    });
  
    it('should revoke tokens and clear cookies even if one revocation fails', async () => {
      // Arrange
      mockAuthService.revokeToken
          .mockResolvedValueOnce('revoked-jti') // Successful revocation for jti
          .mockRejectedValueOnce(new Error('Failed to revoke refresh token')); // Failure for refreshJti
  
      // Act
      const result = await controller.revokeToken(mockUser, mockResponse as Response);
  
      // Assert
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.jti);
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.refreshJti);
  
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
          path: '/authentication/refresh-token',
      });
  
      expect(result).toEqual(['revoked-jti', null]); // One success, one failure
  });
  
  it('should handle missing refreshJti and clear cookies successfully', async () => {
      // Arrange
      const mockUserWithoutRefresh = { ...mockUser, refreshJti: null };
  
      mockAuthService.revokeToken.mockResolvedValueOnce('revoked-jti'); // Success for jti
  
      // Act
      const result = await controller.revokeToken(mockUserWithoutRefresh, mockResponse as Response);
  
      // Assert
      expect(authService.revokeToken).toHaveBeenCalledWith(mockUserWithoutRefresh.jti);
      expect(authService.revokeToken).not.toHaveBeenCalledWith(null);
  
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
          path: '/authentication/refresh-token',
      });
  
      expect(result).toEqual(['revoked-jti', null]); // Only one token was revoked
  });

  it('should log an error and push null to results if revoking access token fails', async () => {
    // Arrange
    
    const mockUser = {
      sub: 1,
      jti: 'mock-jti',
      refreshJti: 'mock-refresh-jti',
      exp: 0,
      iat: 0,
      type: JwtType.ACCESS,
    };

    const errorMessage = 'Failed to revoke access token';
    mockAuthService.revokeToken
      .mockRejectedValueOnce(new Error(errorMessage)) // Simulate failure for jti
      .mockResolvedValueOnce('revoked-refresh-jti');  // Success for refreshJti
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  
    const mockResponse = {
      clearCookie: jest.fn(),
    };
  
    // Act
    const result = await controller.revokeToken(
      mockUser,
      mockResponse as unknown as Response,
    );
  
    // Assert
    expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.jti);
    expect(authService.revokeToken).toHaveBeenCalledWith(mockUser.refreshJti);
  
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to revoke access token (jti):',
      errorMessage,
    );
  
    expect(result).toEqual([null, 'revoked-refresh-jti']);
  
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
      path: '/authentication/refresh-token',
    });
  
    consoleSpy.mockRestore();
  });
  });
});