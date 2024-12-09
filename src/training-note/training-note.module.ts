import { Module } from '@nestjs/common';
import { TrainingNoteService } from './training-note.service';
import { TrainingNoteController } from './training-note.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TrainingNoteController],
  providers: [TrainingNoteService, PrismaService],
})
export class TrainingNoteModule {}
