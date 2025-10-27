import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkoutProgramService } from './workout-program.service';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';
import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
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
    const workoutProgram = await this.workoutProgramService.create(user.sub, createWorkoutProgramDto);
    return new WorkoutProgramEntity(workoutProgram);
  }

  @Get()
  async findAll() {
    const workoutPrograms = await this.workoutProgramService.findAll();
    return workoutPrograms.map(program => new WorkoutProgramEntity(program));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ) {
    const workoutProgram = await this.workoutProgramService.findOne(+id);
    return new WorkoutProgramEntity(workoutProgram);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkoutProgramDto: UpdateWorkoutProgramDto
  ) {
    const updatedWorkoutProgram = await this.workoutProgramService.update(+id, updateWorkoutProgramDto);
    return new WorkoutProgramEntity(updatedWorkoutProgram);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
  ) {
    const removedWorkoutProgram = await this.workoutProgramService.remove(+id);
    return new WorkoutProgramEntity(removedWorkoutProgram);
  }
}
