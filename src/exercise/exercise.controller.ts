import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Role } from '@prisma/client';

import { AuthGuard } from '../authentication/authentication.guard';
import { handleErrors } from '../utils/handle-errors';
import { Roles } from '../decorators/roles.decorator';
import { BaseQueryDto } from '../common/dto/base-query.dto';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseEntity } from './entities/exercise.entity';

@Controller('Exercise')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly ExerciseService: ExerciseService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = await this.ExerciseService.create(createExerciseDto);

      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll(@Query() query: BaseQueryDto) {
    try {
      const exercises = await this.ExerciseService.findAll(query);
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
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    try {
      const exercise =  await this.ExerciseService.update(+id, updateExerciseDto);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      const exercise = await this.ExerciseService.remove(+id);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
