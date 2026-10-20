import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateNotesDto } from './dto/update-notes.dto';
import { CreateNotesDto } from './dto/create-notes.dto';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import { toPagination, toSearch } from '../common/query';

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
        // owner check in each connect: can't attach a note to someone else's data
        workout: createNotesDto.workoutId ? { connect: { id: createNotesDto.workoutId, userId: authorId } } : undefined,
        workoutProgram: createNotesDto.workoutProgramId ? { connect: { id: createNotesDto.workoutProgramId, userId: authorId } } : undefined,
        workoutExercise: createNotesDto.workoutExerciseId ? { connect: { id: createNotesDto.workoutExerciseId, workout: { userId: authorId } } } : undefined,
      },
    })
  }

  async findAll(userId: number, query: GetNotesQueryDto){
    return await this.prisma.notes.findMany({
      where: {
        userId,
        // the FK lives on the other side of these 1-1 relations, so filter through the relation
        ...(query.workoutId && { workout: { id: query.workoutId } }),
        ...(query.workoutProgramId && { workoutProgram: { id: query.workoutProgramId } }),
        ...(query.workoutExerciseId && { workoutExercise: { id: query.workoutExerciseId } }),
        ...toSearch(['title', 'note'], query.search),
      },
      ...toPagination(query, ['createdAt', 'title']),
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.notes.findFirstOrThrow({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: number, updateNotesDto: UpdateNotesDto, userId: number) {
    const { title, note } = updateNotesDto;
    const existingNote = await this.prisma.notes.findFirst({
      where: {
        id,
      },
    });

    if (!existingNote) {
      throw new NotFoundException('Note not found');
    } else if (existingNote.userId != userId) {
      throw new ForbiddenException("Can't modify other people notes")
    }
    return await this.prisma.notes.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(note !== undefined && { note })
      },
    });
  }

  async remove(id: number, userId: number) {
    const existingNote = await this.prisma.notes.findFirst({
      where: {
        id,
      },
    });

    if (!existingNote) {
      throw new NotFoundException('Note not found');
    } else if (existingNote.userId != userId) {
      throw new ForbiddenException("Can't delete other people notes")
    }
    return await this.prisma.notes.delete({
      where: { id  }
    });
  }
}
