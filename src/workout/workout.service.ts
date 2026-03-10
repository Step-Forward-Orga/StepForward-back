import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

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
        workoutProgram: workoutProgramId ? { connect: { id: workoutProgramId } } : undefined,
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

  async findAll() {
    return await this.prisma.workout.findMany({
      include: {
        workoutExercises: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.workout.findUniqueOrThrow({
      where: { id },
      include: {
        workoutExercises: true,
      },
    })
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return await this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.workout.delete({ where: { id } });
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
