import { Test, TestingModule } from '@nestjs/testing';
import { TrainingNoteController } from './training-note.controller';
import { TrainingNoteService } from './training-note.service';

describe('TrainingNoteController', () => {
  let controller: TrainingNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingNoteController],
      providers: [TrainingNoteService],
    }).compile();

    controller = module.get<TrainingNoteController>(TrainingNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
