import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';

import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

// ? user can create, delete, get, delete his workout plans

@Controller('workout-plan')
@UseGuards(AuthGuard)
export class WorkoutController {
  constructor(private readonly WorkoutService: WorkoutService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() CreateWorkoutDto: CreateWorkoutDto
  ) {
    try {
      return await this.WorkoutService.create(user.sub, CreateWorkoutDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.WorkoutService.findAll();
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.WorkoutService.findOne(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateWorkoutDto: UpdateWorkoutDto) {
    try {
      return await this.WorkoutService.update(+id, UpdateWorkoutDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.WorkoutService.remove(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
