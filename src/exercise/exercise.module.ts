import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService, PrismaService],
})
export class ExerciseModule {}
