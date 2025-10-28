import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../authentication/authentication.guard';
import { handleErrors } from '../utils/handle-errors';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';
import { ExerciseEntity } from './entities/exercise.entity';

@Controller('Exercise')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly ExerciseService: ExerciseService) {}

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = await this.ExerciseService.create(createExerciseDto);

      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const exercises = await this.ExerciseService.findAll();

      // return exercises;
      //TODO: fix the line below, problem with the entities declarations
      return exercises.map((exercise) => new ExerciseEntity(exercise));
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const exercise =  await this.ExerciseService.findOne(+id);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    try {
      const exercise =  await this.ExerciseService.update(+id, updateExerciseDto);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string, @Body() completeExerciseDto: CompleteExerciseDto) {
    try {
      const exercise = await this.ExerciseService.complete(+id, completeExerciseDto);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const exercise = await this.ExerciseService.remove(+id);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
