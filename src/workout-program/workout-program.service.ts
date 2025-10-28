import { Injectable } from '@nestjs/common';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkoutProgramService {
  constructor(
    private readonly prisma: PrismaService
  ) {} 
  async create(userId: number, createWorkoutProgramDto: CreateWorkoutProgramDto) {
    return await this.prisma.workoutProgram.create({
      data: {
        title: createWorkoutProgramDto.title,
        description: createWorkoutProgramDto.description,
        user: { connect: { id: userId } },
      }
    });
  }

  async findAll() {
    return await this.prisma.workoutProgram.findMany({
      include: {
        workouts: {
          include: {
            user: {
              select: { 
                id: true,
                username: true,
                email: true,
                roles: true
              }
            }
          }
        },
        user: true,
        note: true
      }
    }
    );
  }

  async findOne(id: number) {
    return await this.prisma.workoutProgram.findUniqueOrThrow({
      where: { id },
      include: {
        workouts: {
          include: {
            user: true,
          }
        },
        user: true,
        note: true
      }
    });
  }

  async update(id: number, updateWorkoutProgramDto: UpdateWorkoutProgramDto) {
    return await this.prisma.workoutProgram.update({
      where: { id },
      data: updateWorkoutProgramDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.workoutProgram.delete({
      where: { id },
    });
  }
}
