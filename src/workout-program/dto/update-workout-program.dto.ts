import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutProgramDto } from './create-workout-program.dto';

export class UpdateWorkoutProgramDto extends PartialType(CreateWorkoutProgramDto) {}
