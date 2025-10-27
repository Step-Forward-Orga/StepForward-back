import { Module } from '@nestjs/common';
import { WorkoutProgramService } from './workout-program.service';
import { WorkoutProgramController } from './workout-program.controller';

@Module({
  controllers: [WorkoutProgramController],
  providers: [WorkoutProgramService],
})
export class WorkoutProgramModule {}
