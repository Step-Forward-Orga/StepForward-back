import { Injectable } from '@nestjs/common';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';

@Injectable()
export class WorkoutProgramService {
  create(createWorkoutProgramDto: CreateWorkoutProgramDto) {
    return 'This action adds a new workoutProgram';
  }

  findAll() {
    return `This action returns all workoutProgram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workoutProgram`;
  }

  update(id: number, updateWorkoutProgramDto: UpdateWorkoutProgramDto) {
    return `This action updates a #${id} workoutProgram`;
  }

  remove(id: number) {
    return `This action removes a #${id} workoutProgram`;
  }
}
