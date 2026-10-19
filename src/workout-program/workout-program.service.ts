import { Injectable } from '@nestjs/common';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';
import { GetWorkoutProgramsQueryDto } from './dto/get-workout-program-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { toInclude, toPagination, toSearch } from '../common/query';

const INCLUDABLE = ['workouts', 'note'];

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

  async findAll(userId: number, query: GetWorkoutProgramsQueryDto) {
    return await this.prisma.workoutProgram.findMany({
      where: { userId, ...toSearch(['title', 'description'], query.search) },
      include: toInclude(query.include, INCLUDABLE),
      ...toPagination(query, ['createdAt', 'title']),
    });
  }

  async findOne(id: number, userId: number, include?: string[]) {
    return await this.prisma.workoutProgram.findFirstOrThrow({
      where: { id, userId },
      include: toInclude(include, INCLUDABLE),
    });
  }

  async update(id: number, userId: number, updateWorkoutProgramDto: UpdateWorkoutProgramDto) {
    return await this.prisma.workoutProgram.update({
      where: { id, userId },
      data: updateWorkoutProgramDto,
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.workoutProgram.delete({
      where: { id, userId },
    });
  }
}
