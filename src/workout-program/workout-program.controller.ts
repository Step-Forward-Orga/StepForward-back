import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkoutProgramService } from './workout-program.service';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';

@Controller('workout-program')
export class WorkoutProgramController {
  constructor(private readonly workoutProgramService: WorkoutProgramService) {}

  @Post()
  create(@Body() createWorkoutProgramDto: CreateWorkoutProgramDto) {
    return this.workoutProgramService.create(createWorkoutProgramDto);
  }

  @Get()
  findAll() {
    return this.workoutProgramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutProgramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutProgramDto: UpdateWorkoutProgramDto) {
    return this.workoutProgramService.update(+id, updateWorkoutProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutProgramService.remove(+id);
  }
}
