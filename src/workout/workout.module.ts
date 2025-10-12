import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';

@Module({
  controllers: [WorkoutController],
  providers: [WorkoutService, PrismaService],
})
export class WorkoutModule {}
