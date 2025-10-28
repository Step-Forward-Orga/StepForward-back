import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return await this.prisma.exercise.create({
      data: {
        exerciseName: createExerciseDto.exerciseName,
        //! exerciseId: createExerciseDto.exerciseId, String In the future were the exercise dataset will be used
        restTime: createExerciseDto.restTime,
        completed: createExerciseDto.completed,
        workoutId: createExerciseDto.workoutId,
        plannedSets: {
          create: createExerciseDto.plannedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type
          })),
        },
      },
      include: { plannedSets: true },
    })
  }

  async complete(id: number, CompleteExerciseDto: CompleteExerciseDto) {
    return await this.prisma.exercise.update({
      where: { id },
      data: { 
        completed: CompleteExerciseDto.completed,
        completedSets: {
          create: CompleteExerciseDto.completedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order,
            type: set.type
          })),
        },
        completedAt: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prisma.exercise.findMany({
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
      },
    }); 
  }

  async findOne(id: number) {
    return await this.prisma.exercise.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const { workoutId, plannedSets, ...updateData } = updateExerciseDto;
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

    return await this.prisma.exercise.update({
      where: { id },
      data: prismaData,
    });
  }

  async remove(id: number) {
    return await this.prisma.exercise.delete({ where: { id } });
  }
}
