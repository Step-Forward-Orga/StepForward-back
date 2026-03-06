import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkoutExerciseService } from './workout-exercise.service';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { handleErrors } from '../utils/handle-errors';
import { WorkoutExerciseEntity } from './entities/workout-exercise.entity';
import { CompleteWorkoutExerciseDto } from './dto/complete-workout-exercise.dto';
import { AuthGuard } from '../authentication/authentication.guard';

@Controller('workout-exercise')
@UseGuards(AuthGuard)
export class WorkoutExerciseController {
  constructor(private readonly workoutExerciseService: WorkoutExerciseService) {}

  @Post()
  async create(@Body() createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    try {
      const workoutExercises = await this.workoutExerciseService.create(createWorkoutExerciseDto);
      return new WorkoutExerciseEntity(workoutExercises);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const workoutExercises = await this.workoutExerciseService.findAll();

      // return workoutExercises.map((workoutExercise) => new WorkoutExerciseEntity(workoutExercise));
      return workoutExercises;
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const exercise = await this.workoutExerciseService.findOne(+id);

      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    try {
      const exercise = await this.workoutExerciseService.update(+id, updateWorkoutExerciseDto);

      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id/complete')
    async complete(@Param('id') id: string, @Body() completeExerciseDto: CompleteWorkoutExerciseDto) {
      try {
        const exercise = await this.workoutExerciseService.complete(+id, completeExerciseDto);
        return new WorkoutExerciseEntity(exercise);
      } catch (error: unknown) {
        handleErrors(error);
      }
    }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const exercise = await this.workoutExerciseService.remove(+id);
      return new WorkoutExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
