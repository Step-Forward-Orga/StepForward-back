import { Module } from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService, PrismaService],
})
export class WorkoutPlanModule {}
