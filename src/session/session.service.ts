import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { toInclude, toPagination, toSearch } from '../common/query';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { GetSessionsQueryDto } from './dto/get-sessions-query.dto';
import { AddSessionExerciseDto, UpdateSessionExerciseDto } from './dto/session-exercise.dto';
import { LogSetDto, UpdateLoggedSetDto } from './dto/logged-set.dto';

// Everything the logging screen needs: exercises in order, their sets, and the planned targets
const DETAIL = {
  exercises: {
    orderBy: { order: 'asc' as const },
    include: {
      exercise: true,
      sets: { orderBy: { order: 'asc' as const } },
      workoutExercise: { include: { plannedSets: { orderBy: { order: 'asc' as const } } } },
    },
  },
};

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async start(userId: number, createSessionDto: CreateSessionDto) {
    const workout = createSessionDto.workoutId
      ? await this.prisma.workout.findFirstOrThrow({
          where: { id: createSessionDto.workoutId, userId },
          include: { workoutExercises: { orderBy: { order: 'asc' } } },
        })
      : null;

    return await this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId: workout?.id,
        title: createSessionDto.title ?? workout?.title ?? 'Workout',
        exercises: {
          create: (workout?.workoutExercises ?? []).map((workoutExercise, index) => ({
            order: index + 1,
            exerciseId: workoutExercise.exerciseId,
            workoutExerciseId: workoutExercise.id,
          })),
        },
      },
      include: DETAIL,
    });
  }

  async findAll(userId: number, query: GetSessionsQueryDto) {
    return await this.prisma.workoutSession.findMany({
      where: { userId, workoutId: query.workoutId, ...toSearch(['title', 'note'], query.search) },
      include: toInclude(query.include, ['workout', 'exercises']),
      ...toPagination(query, ['startedAt', 'finishedAt', 'title']),
    });
  }

  async findOne(id: number, userId: number) {
    return await this.prisma.workoutSession.findFirstOrThrow({
      where: { id, userId },
      include: DETAIL,
    });
  }

  async update(id: number, userId: number, updateSessionDto: UpdateSessionDto) {
    return await this.prisma.workoutSession.update({
      where: { id, userId },
      data: updateSessionDto,
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.workoutSession.delete({ where: { id, userId } });
  }

  async addExercise(sessionId: number, userId: number, { exerciseId, note, order }: AddSessionExerciseDto) {
    return await this.prisma.sessionExercise.create({
      data: {
        order: order ?? (await this.prisma.sessionExercise.count({ where: { sessionId } })) + 1,
        note,
        session: { connect: { id: sessionId, userId } },
        exercise: { connect: { id: exerciseId, OR: [{ userId: null }, { userId }] } },
      },
      include: { exercise: true, sets: true },
    });
  }

  async updateExercise(id: number, userId: number, updateSessionExerciseDto: UpdateSessionExerciseDto) {
    return await this.prisma.sessionExercise.update({
      where: { id, session: { userId } },
      data: updateSessionExerciseDto,
    });
  }

  async removeExercise(id: number, userId: number) {
    return await this.prisma.sessionExercise.delete({ where: { id, session: { userId } } });
  }

  async logSet(sessionExerciseId: number, userId: number, { order, ...set }: LogSetDto) {
    return await this.prisma.loggedSet.create({
      data: {
        ...set,
        order: order ?? (await this.prisma.loggedSet.count({ where: { sessionExerciseId } })) + 1,
        sessionExercise: { connect: { id: sessionExerciseId, session: { userId } } },
      },
    });
  }

  async updateSet(id: number, userId: number, updateLoggedSetDto: UpdateLoggedSetDto) {
    return await this.prisma.loggedSet.update({
      where: { id, sessionExercise: { session: { userId } } },
      data: updateLoggedSetDto,
    });
  }

  async removeSet(id: number, userId: number) {
    return await this.prisma.loggedSet.delete({ where: { id, sessionExercise: { session: { userId } } } });
  }
}
