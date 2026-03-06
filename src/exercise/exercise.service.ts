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
    return await this.prisma.exercise.create({
      data: {
        name: createExerciseDto.name,
        description: createExerciseDto.description ?? ""
      },
    })
  }

  async findAll() {
    return await this.prisma.exercise.findMany({
      include: { 
        workoutExercises: {
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
        }},
    }); 
  }

  async findOne(id: number) {
    return await this.prisma.exercise.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.exercise.delete({ where: { id } });
  }
}
