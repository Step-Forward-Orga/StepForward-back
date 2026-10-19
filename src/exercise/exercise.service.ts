import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { toPagination, toSearch } from '../common/query';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return await this.prisma.exercise.create({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description ?? ""
      },
    })
  }

  async findAll(query: BaseQueryDto) {
    return await this.prisma.exercise.findMany({
      where: toSearch(['name', 'description'], query.search),
      ...toPagination(query, ['name']),
    });
  }

  async findOne(id: number) {
    return await this.prisma.exercise.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.exercise.delete({ where: { id } });
  }
}
