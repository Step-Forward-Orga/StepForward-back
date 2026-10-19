import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WorkoutExerciseService } from './workout-exercise.service';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { GetWorkoutExercisesQueryDto } from './dto/get-workout-exercise-query.dto';
import { handleErrors } from '../utils/handle-errors';
import { WorkoutExerciseEntity } from './entities/workout-exercise.entity';
import { CompleteWorkoutExerciseDto } from './dto/complete-workout-exercise.dto';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { BaseQueryDto } from '../common/dto/base-query.dto';

@Controller('workout-exercise')
@UseGuards(AuthGuard)
export class WorkoutExerciseController {
  constructor(private readonly workoutExerciseService: WorkoutExerciseService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createWorkoutExerciseDto: CreateWorkoutExerciseDto
  ) {
    try {
      const workoutExercises = await this.workoutExerciseService.create(user.sub, createWorkoutExerciseDto);
      return new WorkoutExerciseEntity(workoutExercises);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll(
    @User() user: JwtPayload,
    @Query() query: GetWorkoutExercisesQueryDto
  ) {
    try {
      const workoutExercises = await this.workoutExerciseService.findAll(user.sub, query);
      return workoutExercises.map((workoutExercise) => new WorkoutExerciseEntity(workoutExercise));
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Query() query: BaseQueryDto
  ) {
    try {
      const exercise = await this.workoutExerciseService.findOne(+id, user.sub, query.include);

      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateWorkoutExerciseDto: UpdateWorkoutExerciseDto
  ) {
    try {
      const exercise = await this.workoutExerciseService.update(+id, user.sub, updateWorkoutExerciseDto);

      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id/complete')
  async complete(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() completeExerciseDto: CompleteWorkoutExerciseDto
  ) {
    try {
      const exercise = await this.workoutExerciseService.complete(+id, user.sub, completeExerciseDto);
      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(
    @User() user: JwtPayload,
    @Param('id') id: string
  ) {
    try {
      const exercise = await this.workoutExerciseService.remove(+id, user.sub);
      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
