import { Injectable } from '@nestjs/common';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import  { CompleteWorkoutExerciseDto } from './dto/complete-workout-exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    return await this.prisma.workoutExercise.create({
      data: {
        exerciseId: createWorkoutExerciseDto.exerciseId,
        restTime: createWorkoutExerciseDto.restTime,
        completed: createWorkoutExerciseDto.completed,
        workoutId: createWorkoutExerciseDto.workoutId,
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

  async findAll() {
    return await this.prisma.workoutExercise.findMany({
      include: {
        plannedSets: true,
        completedSets: true,
        workout: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              }
            }          }
        },
        note: true
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.workoutExercise.findUniqueOrThrow({
      where: {id}
    });
  }

  async complete(id: number, CompleteWorkoutExerciseDto: CompleteWorkoutExerciseDto) {
    return await this.prisma.workoutExercise.update({
      where: { id },
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

  async update(id: number, updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    const { workoutId, plannedSets, ...updateData } = updateWorkoutExerciseDto;
    const prismaData: any = { ...updateData };

    if (plannedSets) {
      prismaData.plannedSets = {
        set: plannedSets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          order: set.order,
          type: set.type,
        })),
      };
    }

    return await this.prisma.workoutExercise.update({
      where: { id },
      data: prismaData,
    });
  }

  async remove(id: number) {
    return await this.prisma.workoutExercise.delete({ where: { id } });
  }
}
