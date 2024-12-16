import { Injectable } from '@nestjs/common';
import { connect } from 'http2';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateTrainingNoteDto } from './dto/update-training-note.dto';

@Injectable()
export class TrainingNoteService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(
    authorId: number,
    title: string,
    note: string,
  ) {
    return await this.prisma.trainingNote.create({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
      },
    })
  }

  async findAll() {
    return await this.prisma.trainingNote.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.trainingNote.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateTrainingNoteDto: UpdateTrainingNoteDto) {
    const { title, note } = updateTrainingNoteDto;

    return await this.prisma.trainingNote.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(note !== undefined && { note })
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.trainingNote.delete({ where: { id } });
  }
}
