import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { toPagination, toSearch } from '../common/query';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

// userId null = global catalog, readable by everyone, editable by admins only
const visibleTo = (userId: number) => ({ OR: [{ userId: null }, { userId }] });
const editableBy = (userId: number, isAdmin: boolean) => (isAdmin ? visibleTo(userId) : { userId });

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // admins add to the global catalog, everyone else creates a private exercise
  async create(userId: number, isAdmin: boolean, createExerciseDto: CreateExerciseDto) {
    return await this.prisma.exercise.create({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description ?? "",
        userId: isAdmin ? null : userId,
      },
    })
  }

  async findAll(userId: number, query: BaseQueryDto) {
    return await this.prisma.exercise.findMany({
      where: { AND: [visibleTo(userId), toSearch(['name', 'description'], query.search)] },
      ...toPagination(query, ['name']),
    });
  }

  async findOne(id: number, userId: number) {
    return await this.prisma.exercise.findFirstOrThrow({
      where: { id, ...visibleTo(userId) },
    });
  }

  async update(id: number, userId: number, isAdmin: boolean, updateExerciseDto: UpdateExerciseDto) {
    return await this.prisma.exercise.update({
      where: { id, ...editableBy(userId, isAdmin) },
      data: updateExerciseDto,
    });
  }

  async remove(id: number, userId: number, isAdmin: boolean) {
    return await this.prisma.exercise.delete({ where: { id, ...editableBy(userId, isAdmin) } });
  }
}
