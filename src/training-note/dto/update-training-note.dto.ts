import { PartialType } from '@nestjs/swagger';
import { CreateTrainingNoteDto } from './create-training-note.dto';

export class UpdateTrainingNoteDto extends PartialType(CreateTrainingNoteDto) {}
