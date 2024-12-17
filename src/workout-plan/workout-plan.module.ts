import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';

@Module({
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService, PrismaService],
})
export class WorkoutPlanModule {}
