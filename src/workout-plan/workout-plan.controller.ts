import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';

import { WorkoutPlanService } from './workout-plan.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

// ? user can create, delete, get, delete his workout plans

@Controller('workout-plan')
@UseGuards(AuthGuard)
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createWorkoutPlanDto: CreateWorkoutPlanDto
  ) {
    try {
      return await this.workoutPlanService.create(user.sub, createWorkoutPlanDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.workoutPlanService.findAll();
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.workoutPlanService.findOne(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto) {
    try {
      return await this.workoutPlanService.update(+id, updateWorkoutPlanDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.workoutPlanService.remove(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
