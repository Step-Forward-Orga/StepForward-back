import { Test, TestingModule } from '@nestjs/testing';
import { TrainingNoteService } from './training-note.service';

describe('TrainingNoteService', () => {
  let service: TrainingNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingNoteService],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
