import { Injectable } from '@nestjs/common';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutPlanService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create(
    userId: number,
    createWorkoutPlanDto: CreateWorkoutPlanDto
  ) {
    return await this.prisma.workoutPlan.create({
      data: {
        userId,
        title: createWorkoutPlanDto.title,
        description: createWorkoutPlanDto.description,
      },
    });
  }

  async findAll() {
    return await this.prisma.workoutPlan.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.workoutPlan.findUniqueOrThrow({
      where: { id },
    })
  }

  async update(id: number, updateWorkoutPlanDto: UpdateWorkoutPlanDto) {
    return await this.prisma.workoutPlan.update({
      where: { id },
      data: updateWorkoutPlanDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.workoutPlan.delete({ where: { id } });
  }
}
