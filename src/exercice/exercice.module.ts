import { Module } from '@nestjs/common';
import { ExerciceService } from './exercice.service';
import { ExerciceController } from './exercice.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExerciceController],
  providers: [ExerciceService, PrismaService],
})
export class ExerciceModule {}
