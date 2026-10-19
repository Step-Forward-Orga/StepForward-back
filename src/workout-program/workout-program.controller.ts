import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WorkoutProgramService } from './workout-program.service';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';
import { GetWorkoutProgramsQueryDto } from './dto/get-workout-program-query.dto';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { handleErrors } from '../utils/handle-errors';
import { BaseQueryDto } from '../common/dto/base-query.dto';
import { WorkoutProgramEntity } from './entities/workout-program.entity';

@Controller('workout-program')
@UseGuards(AuthGuard)
export class WorkoutProgramController {
  constructor(private readonly workoutProgramService: WorkoutProgramService) {}

  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createWorkoutProgramDto: CreateWorkoutProgramDto
  ) {
    try {
      const workoutProgram = await this.workoutProgramService.create(user.sub, createWorkoutProgramDto);
      return new WorkoutProgramEntity(workoutProgram);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Get()
  async findAll(
    @User() user: JwtPayload,
    @Query() query: GetWorkoutProgramsQueryDto
  ) {
    try {
      const workoutPrograms = await this.workoutProgramService.findAll(user.sub, query);
      return workoutPrograms.map(program => new WorkoutProgramEntity(program));
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
      const workoutProgram = await this.workoutProgramService.findOne(+id, user.sub, query.include);
      return new WorkoutProgramEntity(workoutProgram);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Patch(':id')
  async update(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateWorkoutProgramDto: UpdateWorkoutProgramDto
  ) {
    try {
      const updatedWorkoutProgram = await this.workoutProgramService.update(+id, user.sub, updateWorkoutProgramDto);
      return new WorkoutProgramEntity(updatedWorkoutProgram);
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
      const removedWorkoutProgram = await this.workoutProgramService.remove(+id, user.sub);
      return new WorkoutProgramEntity(removedWorkoutProgram);
    } catch (error: unknown) {
      handleErrors(error);
    }
  }
}
