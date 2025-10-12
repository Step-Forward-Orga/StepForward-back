import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create(
    userId: number,
    createWorkoutDto: CreateWorkoutDto
  ) {
    return await this.prisma.workout.create({
      data: {
        userId,
        title: createWorkoutDto.title,
        description: createWorkoutDto.description,
      },
    });
  }

  async findAll() {
    return await this.prisma.workout.findMany({
      include: {
        exercises: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.workout.findUniqueOrThrow({
      where: { id },
      include: {
        exercises: true,
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
}
