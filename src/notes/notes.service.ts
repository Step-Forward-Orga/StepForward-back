import { Injectable } from '@nestjs/common';
import { connect } from 'http2';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateNotesDto } from './dto/update-notes.dto';
import { CreateNotesDto } from './dto/create-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(
    authorId: number,
    createNotesDto: CreateNotesDto
  ) {
    return await this.prisma.notes.create({
      data: {
        title: createNotesDto.title,
        note: createNotesDto.note,
        user: { connect: { id: authorId } },
        workout: createNotesDto.workoutId ? { connect: { id: createNotesDto.workoutId } } : undefined,
        workoutProgram: createNotesDto.workoutProgramId ? { connect: { id: createNotesDto.workoutProgramId } } : undefined,
        exercise: createNotesDto.exerciseId ? { connect: { id: createNotesDto.exerciseId } } : undefined,
      },
    })
  }

  async findAll() {
    return await this.prisma.notes.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.notes.findUnique({
      where: { id },
    });
  }

  async update(id: number, UpdateNotesDto: UpdateNotesDto) {
    const { title, note } = UpdateNotesDto;

    return await this.prisma.notes.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(note !== undefined && { note })
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.notes.delete({ where: { id } });
  }
}
