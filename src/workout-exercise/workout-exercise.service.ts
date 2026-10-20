import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { GetWorkoutExercisesQueryDto } from './dto/get-workout-exercise-query.dto';
import { PlannedSetDto } from './dto/planned-set.dto';
import { PrismaService } from '../prisma/prisma.service';
import { toInclude, toPagination } from '../common/query';

const INCLUDABLE = ['plannedSets', 'exercise', 'note', 'workout'];

@Injectable()
export class WorkoutExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(userId: number, createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    return await this.prisma.workoutExercise.create({
      data: {
        // global catalog or one of the user's own exercises
        exercise: { connect: { id: createWorkoutExerciseDto.exerciseId, OR: [{ userId: null }, { userId }] } },
        restTime: createWorkoutExerciseDto.restTime,
        order: createWorkoutExerciseDto.order,
        // userId in the connect: can't add exercises to someone else's workout
        workout: { connect: { id: createWorkoutExerciseDto.workoutId, userId } },
        plannedSets: { create: this.toPlannedSets(createWorkoutExerciseDto.plannedSets) },
      },
      include: { plannedSets: true }
    });
  }

  async findAll(userId: number, query: GetWorkoutExercisesQueryDto) {
    return await this.prisma.workoutExercise.findMany({
      where: {
        workout: { userId },
        workoutId: query.workoutId,
        ...(query.search && { exercise: { name: { contains: query.search, mode: 'insensitive' } } }),
      },
      include: toInclude(query.include, INCLUDABLE),
      ...toPagination(query, ['order', 'createdAt']),
    });
  }

  async findOne(id: number, userId: number, include?: string[]) {
    return await this.prisma.workoutExercise.findFirstOrThrow({
      where: { id, workout: { userId } },
      include: toInclude(include, INCLUDABLE),
    });
  }

  async update(id: number, userId: number, updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    // workoutId ignored: moving an exercise to another workout isn't supported
    const { workoutId, exerciseId, plannedSets, ...updateData } = updateWorkoutExerciseDto;

    return await this.prisma.workoutExercise.update({
      where: { id, workout: { userId } },
      data: {
        ...updateData,
        ...(exerciseId && { exercise: { connect: { id: exerciseId, OR: [{ userId: null }, { userId }] } } }),
        // replace the planned sets: `set` only takes ids, so delete and recreate
        ...(plannedSets && {
          plannedSets: { deleteMany: {}, create: this.toPlannedSets(plannedSets) },
        }),
      },
      include: { plannedSets: true },
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.workoutExercise.delete({ where: { id, workout: { userId } } });
  }

  private toPlannedSets(sets: PlannedSetDto[]) {
    return sets.map(({ order, repsMin, repsMax, weight }) => {
      if (repsMax < repsMin) throw new BadRequestException(`Set ${order}: repsMax must be >= repsMin`);
      return { order, repsMin, repsMax, weight };
    });
  }
}
