import { Injectable } from '@nestjs/common';
import { connect } from 'http2';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateNotesDto } from './dto/update-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(
    authorId: number,
    title: string,
    note: string,
  ) {
    return await this.prisma.notes.create({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
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
