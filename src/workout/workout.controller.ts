import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';

import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutEntity } from './entities/workout.entity';

// ? user can create, delete, get, delete his workout plans

@Controller('workout')
@UseGuards(AuthGuard)
export class WorkoutController {
  constructor(private readonly WorkoutService: WorkoutService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() CreateWorkoutDto: CreateWorkoutDto,
  ) {
    try {
      const workout = await this.WorkoutService.create(user.sub, CreateWorkoutDto);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Post(':id')
  async create_linked(
    @User() user: JwtPayload,
    @Body() CreateWorkoutDto: CreateWorkoutDto,
    @Param('id') workoutProgramId: string,
  ) {
    try {
      const workout = await this.WorkoutService.create_linked(user.sub, CreateWorkoutDto, +workoutProgramId);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const workouts = await this.WorkoutService.findAll();
      return workouts.map((workout) => new WorkoutEntity(workout));
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const workout = await this.WorkoutService.findOne(+id);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateWorkoutDto: UpdateWorkoutDto) {
    try {
      const workout = await this.WorkoutService.update(+id, UpdateWorkoutDto);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const workout = await this.WorkoutService.remove(+id);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
