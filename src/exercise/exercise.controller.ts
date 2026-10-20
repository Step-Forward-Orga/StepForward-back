import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Role } from '@prisma/client';

import { AuthGuard } from '../authentication/authentication.guard';
import { handleErrors } from '../utils/handle-errors';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { BaseQueryDto } from '../common/dto/base-query.dto';

import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseEntity } from './entities/exercise.entity';

const isAdmin = (user: JwtPayload) => !!user.roles?.includes(Role.ADMIN);

@Controller('Exercise')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly ExerciseService: ExerciseService) {}

  @Post()
  async create(@User() user: JwtPayload, @Body() createExerciseDto: CreateExerciseDto) {
    try {
      const exercise = await this.ExerciseService.create(user.sub, isAdmin(user), createExerciseDto);

      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll(@User() user: JwtPayload, @Query() query: BaseQueryDto) {
    try {
      const exercises = await this.ExerciseService.findAll(user.sub, query);
      return exercises.map((exercise) => new ExerciseEntity(exercise));
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id')
  async findOne(@User() user: JwtPayload, @Param('id') id: string) {
    try {
      const exercise =  await this.ExerciseService.findOne(+id, user.sub);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get(':id/history')
  async history(@User() user: JwtPayload, @Param('id') id: string, @Query() query: BaseQueryDto) {
    try {
      return await this.ExerciseService.history(+id, user.sub, query.limit);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(@User() user: JwtPayload, @Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    try {
      const exercise =  await this.ExerciseService.update(+id, user.sub, isAdmin(user), updateExerciseDto);
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Delete(':id')
  async remove(@User() user: JwtPayload, @Param('id') id: string) {
    try {
      const exercise = await this.ExerciseService.remove(+id, user.sub, isAdmin(user));
      return new ExerciseEntity(exercise);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
