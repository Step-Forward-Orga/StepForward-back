import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { TrainingNoteService } from './training-note.service';
import { TrainingNoteController } from './training-note.controller';

@Module({
  controllers: [TrainingNoteController],
  providers: [TrainingNoteService, PrismaService],
})
export class TrainingNoteModule {}
