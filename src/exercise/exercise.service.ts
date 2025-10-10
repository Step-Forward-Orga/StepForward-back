import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create(createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        exerciseName: createExerciseDto.exerciseName,
        exerciseId: createExerciseDto.exerciseId,
        sets: createExerciseDto.sets,
        aimed_reps: createExerciseDto.aimed_reps,
        aimed_weight: createExerciseDto.aimed_weight,
        restTime: createExerciseDto.restTime,
        completed: createExerciseDto.completed ?? false,
        completedWeight: createExerciseDto.completed_weight ?? null,
        completedReps: createExerciseDto.completed_reps ?? null,
        completedSets: createExerciseDto.completed_sets ?? null,
        // Assuming planId is a foreign key to a Workout or similar entity
        planId: createExerciseDto.planId,
      }
    })
  }

  async findAll() {
    return await this.prisma.exercise.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.exercise.findUniqueOrThrow({
      where: { id },
    })
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    })
  }

  async remove(id: number) {
    return await this.prisma.exercise.delete({ where: { id } });
  }
}
