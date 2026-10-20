import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { toPagination, toSearch } from '../common/query';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

// userId null = global catalog, readable by everyone, editable by admins only
const visibleTo = (userId: number) => ({ OR: [{ userId: null }, { userId }] });
const editableBy = (userId: number, isAdmin: boolean) => (isAdmin ? visibleTo(userId) : { userId });

type SetLike = { reps: number; weight: number };

// Per-session numbers for the progression graphs. 1RM uses the Epley formula: weight * (1 + reps / 30)
export function summarizeSets(sets: SetLike[]) {
  const topSet = sets.reduce<SetLike | null>(
    (best, set) => (!best || set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps) ? set : best),
    null,
  );
  const oneRepMax = Math.max(0, ...sets.filter((set) => set.reps > 0).map((set) => set.weight * (1 + set.reps / 30)));
  return {
    topSet,
    volume: sets.reduce((total, set) => total + set.reps * set.weight, 0),
    estimatedOneRepMax: Math.round(oneRepMax * 10) / 10,
  };
}

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // admins add to the global catalog, everyone else creates a private exercise
  async create(userId: number, isAdmin: boolean, createExerciseDto: CreateExerciseDto) {
    // the unique index can't catch this one: Postgres treats NULL userIds as distinct
    if (isAdmin && await this.prisma.exercise.findFirst({ where: { name: createExerciseDto.name, userId: null } })) {
      throw new ConflictException('Already exists');
    }
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

  // Most recent sessions where the user logged this exercise, oldest first for graphing
  async history(id: number, userId: number, limit = 20) {
    await this.findOne(id, userId);
    const sessionExercises = await this.prisma.sessionExercise.findMany({
      where: { exerciseId: id, session: { userId }, sets: { some: {} } },
      include: { session: { select: { id: true, title: true, startedAt: true } }, sets: { orderBy: { order: 'asc' } } },
      orderBy: { session: { startedAt: 'desc' } },
      take: limit,
    });
    return sessionExercises.reverse().map(({ session, sets, note }) => ({
      sessionId: session.id,
      title: session.title,
      date: session.startedAt,
      note,
      sets,
      ...summarizeSets(sets),
    }));
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
