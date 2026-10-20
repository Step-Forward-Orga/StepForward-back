import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { toInclude, toPagination, toSearch } from '../common/query';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { GetWorkoutsQueryDto } from './dto/get-workout-query.dto';

const INCLUDABLE = ['workoutExercises', 'note', 'workoutProgram'];

@Injectable()
export class WorkoutService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create_linked(
    userId: number,
    createWorkoutDto: CreateWorkoutDto,
    workoutProgramId: number
  ) {
    const workout = await this.prisma.workout.create({
      data: {
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        user: { connect: { id: userId } },
        code: '',
        // userId in the connect: can't link a workout to someone else's program
        workoutProgram: workoutProgramId ? { connect: { id: workoutProgramId, userId } } : undefined,
      },
    });
    const code = this.buildWorkoutCode(workout.title, workout.id);

    return await this.prisma.workout.update({
      where: { id: workout.id },
      data: { code },
    });
  }

  async create(
    userId: number,
    createWorkoutDto: CreateWorkoutDto,
  ) {
    const workout = await this.prisma.workout.create({
      data: {
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
        user: { connect: { id: userId } },
        code: '',
      },
    });
    const code = this.buildWorkoutCode(workout.title, workout.id);

    return await this.prisma.workout.update({
      where: { id: workout.id },
      data: { code },
    });
  }

  async findAll(userId: number, query: GetWorkoutsQueryDto) {
    return await this.prisma.workout.findMany({
      where: {
        userId,
        workoutProgramId: query.workoutProgramId,
        ...toSearch(['title', 'description'], query.search),
      },
      include: toInclude(query.include, INCLUDABLE),
      ...toPagination(query, ['createdAt', 'title']),
    });
  }

  async findOne(id: number, userId: number, include?: string[]) {
    return await this.prisma.workout.findFirstOrThrow({
      where: { id, userId },
      include: toInclude(include, INCLUDABLE),
    })
  }

  async update(id: number, userId: number, updateWorkoutDto: UpdateWorkoutDto) {
    return await this.prisma.workout.update({
      where: { id, userId },
      data: updateWorkoutDto,
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.workout.delete({ where: { id, userId } });
  }

  private buildWorkoutCode(title: string, id: number) {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return `${slug || 'workout'}-${id}`
  }
}
