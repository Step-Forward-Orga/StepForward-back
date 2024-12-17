import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../prisma/prisma.module';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    })
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
