import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentials } from '../errors/InvalidCredentials';

import { UserService } from './user.service';

describe('UserService - updatePassword', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

it('should successfully update the password', async () => {
  const userId = 1;
  const oldPassword = 'oldPassword';
  const newPassword = 'newPassword';
  const hashedPassword = 'hashedNewPassword';

  const mockUser = {
    id: userId,
    password: 'hashedOldPassword',
  };

  const updateSpy = jest.fn().mockResolvedValue(undefined);

  prismaService.user.findUniqueOrThrow = jest.fn().mockResolvedValueOnce(mockUser);
  prismaService.user.update = updateSpy;
  jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true); // Old password matches
  jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);

  // Act
  await service.updatePassword(userId, oldPassword, newPassword, newPassword);

  // Assert
  expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: userId } });
  expect(bcrypt.compare).toHaveBeenCalledWith(oldPassword, mockUser.password);
  expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
  expect(updateSpy).toHaveBeenCalledTimes(1);
  expect(updateSpy).toHaveBeenCalledWith({
    where: { id: userId },
    data: { password: hashedPassword },
  });
});

  it('should throw BadRequestException if passwords do not match', async () => {
    // Arrange
    const userId = 1;
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword';
    const newPasswordConfirm = 'differentNewPassword';

    // Act & Assert
    await expect(
      service.updatePassword(userId, oldPassword, newPassword, newPasswordConfirm),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw InvalidCredentials if old password is incorrect', async () => {
    // Arrange
    const userId = 1;
    const oldPassword = 'wrongOldPassword';
    const newPassword = 'newPassword';
    const newPasswordConfirm = 'newPassword';

    const mockUser = {
      id: userId,
      password: 'hashedOldPassword',
    };

    prismaService.user.findUniqueOrThrow = jest.fn().mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false); // Old password does not match

    // Act & Assert
    await expect(
      service.updatePassword(userId, oldPassword, newPassword, newPasswordConfirm),
    ).rejects.toThrow(InvalidCredentials);
  });
});

describe('UserService - updateEmail', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        update: jest.fn(), // Mock the update method
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update the email', async () => {
    // Arrange
    const userId = 1;
    const newEmail = 'newemail@example.com';
    const updatedUser = {
      id: userId,
      email: newEmail,
    };

    prismaService.user.update = jest.fn().mockResolvedValueOnce(updatedUser); // Mock the update method

    // Act
    const result = await service.updateEmail(userId, newEmail);

    // Assert
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { email: newEmail },
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw an error if the update fails', async () => {
    // Arrange
    const userId = 1;
    const newEmail = 'invalidemail@example.com';
    const mockError = new Error('Database update failed');

    prismaService.user.update = jest.fn().mockRejectedValueOnce(mockError); // Mock the update method to throw an error

    // Act & Assert
    await expect(service.updateEmail(userId, newEmail)).rejects.toThrow(mockError);
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { email: newEmail },
    });
  });
});