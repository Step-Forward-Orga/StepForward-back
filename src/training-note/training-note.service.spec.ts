import { Test, TestingModule } from '@nestjs/testing';
import { TrainingNoteService } from './training-note.service';

import { PrismaService } from'../prisma/prisma.service';

describe('TrainingNoteService', () => {
  let service: TrainingNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingNoteService, PrismaService],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
