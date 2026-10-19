import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';

import { handleErrors } from '../utils/handle-errors';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { BaseQueryDto } from '../common/dto/base-query.dto';

import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { GetWorkoutsQueryDto } from './dto/get-workout-query.dto';
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
  async findAll(@User() user: JwtPayload, @Query() query: GetWorkoutsQueryDto) {
    try {
      const workouts = await this.WorkoutService.findAll(user.sub, query);
      return workouts.map((workout) => new WorkoutEntity(workout));
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@User() user: JwtPayload, @Param('id') id: string, @Query() query: BaseQueryDto) {
    try {
      const workout = await this.WorkoutService.findOne(+id, user.sub, query.include);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@User() user: JwtPayload, @Param('id') id: string, @Body() UpdateWorkoutDto: UpdateWorkoutDto) {
    try {
      const workout = await this.WorkoutService.update(+id, user.sub, UpdateWorkoutDto);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@User() user: JwtPayload, @Param('id') id: string) {
    try {
      const workout = await this.WorkoutService.remove(+id, user.sub);
      return new WorkoutEntity(workout);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
