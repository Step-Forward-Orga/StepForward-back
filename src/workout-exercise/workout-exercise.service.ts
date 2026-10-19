import { Injectable } from '@nestjs/common';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import  { CompleteWorkoutExerciseDto } from './dto/complete-workout-exercise.dto';
import { GetWorkoutExercisesQueryDto } from './dto/get-workout-exercise-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { toInclude, toPagination } from '../common/query';

const INCLUDABLE = ['plannedSets', 'completedSets', 'exercise', 'note', 'workout'];

@Injectable()
export class WorkoutExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(userId: number, createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    return await this.prisma.workoutExercise.create({
      data: {
        exercise: { connect: { id: createWorkoutExerciseDto.exerciseId } },
        restTime: createWorkoutExerciseDto.restTime,
        completed: createWorkoutExerciseDto.completed,
        // userId in the connect: can't add exercises to someone else's workout
        workout: { connect: { id: createWorkoutExerciseDto.workoutId, userId } },
        plannedSets: {
          create: createWorkoutExerciseDto.plannedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type
          })),
        },
      },
      include: { plannedSets: true }
    });
  }

  async findAll(userId: number, query: GetWorkoutExercisesQueryDto) {
    return await this.prisma.workoutExercise.findMany({
      where: {
        workout: { userId },
        workoutId: query.workoutId,
        completed: query.completed,
        ...(query.search && { exercise: { name: { contains: query.search, mode: 'insensitive' } } }),
      },
      include: toInclude(query.include, INCLUDABLE),
      ...toPagination(query, ['createdAt', 'completedAt']),
    });
  }

  async findOne(id: number, userId: number, include?: string[]) {
    return await this.prisma.workoutExercise.findFirstOrThrow({
      where: { id, workout: { userId } },
      include: toInclude(include, INCLUDABLE),
    });
  }

  async complete(id: number, userId: number, CompleteWorkoutExerciseDto: CompleteWorkoutExerciseDto) {
    return await this.prisma.workoutExercise.update({
      where: { id, workout: { userId } },
      data: {
        completed: CompleteWorkoutExerciseDto.completed,
        completedSets: {
          create: CompleteWorkoutExerciseDto.completedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type
          })),
        },
        completedAt: new Date(),
      },
      include: {
        completedSets: true,
        plannedSets: true
      }
    });
  }

  async update(id: number, userId: number, updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    // workoutId ignored: moving an exercise to another workout isn't supported
    const { workoutId, plannedSets, ...updateData } = updateWorkoutExerciseDto;

    return await this.prisma.workoutExercise.update({
      where: { id, workout: { userId } },
      data: {
        ...updateData,
        // replace the planned sets: `set` only takes ids, so delete and recreate
        ...(plannedSets && {
          plannedSets: {
            deleteMany: {},
            create: plannedSets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
              order: set.order,
              type: set.type,
            })),
          },
        }),
      },
      include: { plannedSets: true },
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.workoutExercise.delete({ where: { id, workout: { userId } } });
  }
}
