import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentials } from '../errors/InvalidCredentials';

@Injectable()
export class UserService {
  constructor (
    private readonly prisma: PrismaService,
  ) {}

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (newPassword!== newPasswordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new InvalidCredentials();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateEmail(userId: number, newEmail: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}
