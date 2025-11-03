import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface'; // make sure the import is present
import { JwtType } from '../authentication/enums/JwtType.enum';


describe('UserController', () => {
  let controller: UserController;
  let userService: any;

  // Mock DTOs and user
  const mockUser: JwtPayload = {
  sub: 1,
  exp: Date.now() + 1000,      // or any fixed timestamp
  iat: Date.now(),
  jti: 'test-jti',
  type: JwtType.ACCESS,        // or JwtType.REFRESH depending on the test
  refreshJti: 'test-refresh-jti',
};
  const updatePasswordDto = {
    oldPassword: 'oldPass',
    newPassword: 'newPass',
    newPasswordConfirm: 'newPass',
  };
  const updateEmailDto = {
    newEmail: 'new@example.com',
  };

  const mockUserService = {
    updatePassword: jest.fn(),
    updateEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        Reflector, // Reflector is required for guards
        {
          provide: APP_GUARD,
          useClass: AuthGuard, // Use a mocked AuthGuard
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    // Reset mocks before each test
    mockUserService.updatePassword.mockReset();
    mockUserService.updateEmail.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updatePassword', () => {
    it('should successfully update password', async () => {
      mockUserService.updatePassword.mockResolvedValueOnce(undefined);
      const result = await controller.updatePassword(mockUser, updatePasswordDto);
      expect(userService.updatePassword).toHaveBeenCalledWith(
        mockUser.sub,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword,
        updatePasswordDto.newPasswordConfirm,
      );
      expect(result).toEqual({ success: true, message: 'Password updated successfully.' });
    });

    it('should handle errors thrown during password update', async () => {
      mockUserService.updatePassword.mockRejectedValueOnce(new Error('Update failed'));
      await expect(
        controller.updatePassword(mockUser, updatePasswordDto),
      ).rejects.toThrow();
    });
  });

  describe('updateEmail', () => {
    it('should successfully update email', async () => {
      mockUserService.updateEmail.mockResolvedValueOnce(undefined);
      const result = await controller.updateEmail(mockUser, updateEmailDto);
      expect(userService.updateEmail).toHaveBeenCalledWith(
        mockUser.sub,
        updateEmailDto.newEmail,
      );
      expect(result).toEqual({ success: true, message: 'Email updated successfully.' });
    });

    it('should handle errors thrown during email update', async () => {
      mockUserService.updateEmail.mockRejectedValueOnce(new Error('Update failed'));
      await expect(
        controller.updateEmail(mockUser, updateEmailDto),
      ).rejects.toThrow();
    });
  });
});
