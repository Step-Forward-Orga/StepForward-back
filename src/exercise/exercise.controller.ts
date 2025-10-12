import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../authentication/authentication.guard';
import { handleErrors } from '../utils/handle-errors';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';

@Controller('Exercise')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly ExerciseService: ExerciseService) {}

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    try {
      return await this.ExerciseService.create(createExerciseDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.ExerciseService.findAll();
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.ExerciseService.findOne(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    try {
      return await this.ExerciseService.update(+id, updateExerciseDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string, @Body() completeExerciseDto: CompleteExerciseDto) {
    try {
      return await this.ExerciseService.complete(+id, completeExerciseDto);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.ExerciseService.remove(+id);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
