import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from'../prisma/prisma.service';

import { TrainingNoteService } from './training-note.service';
import { UpdateTrainingNoteDto } from './dto/update-training-note.dto';

describe('TrainingNoteService - create', () => {
  let service: TrainingNoteService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    trainingNote: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingNoteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully create a training note', async () => {
    // Arrange
    const authorId = 1;
    const title = 'My First Note';
    const note = 'This is my training note.';

    const mockCreatedNote = {
      id: 1,
      title,
      note,
      userId: authorId,
    };

    mockPrisma.trainingNote.create.mockResolvedValueOnce(mockCreatedNote);

    // Act
    const result = await service.create(authorId, title, note);

    // Assert
    expect(prisma.trainingNote.create).toHaveBeenCalledWith({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
      },
    });

    expect(result).toEqual(mockCreatedNote);
  });

  it('should throw an error if training note creation fails', async () => {
    // Arrange
    const authorId = 1;
    const title = 'My Failed Note';
    const note = 'This will fail.';

    const mockError = new Error('Database connection failed');

    mockPrisma.trainingNote.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(authorId, title, note)).rejects.toThrow(
      'Database connection failed',
    );

    expect(prisma.trainingNote.create).toHaveBeenCalledWith({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
      },
    });
  });
});

describe('TrainingNoteService - findAll', () => {
  let service: TrainingNoteService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    trainingNote: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingNoteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all training notes successfully', async () => {
    // Arrange
    const mockTrainingNotes = [
      { id: 1, title: 'Note 1', note: 'Content 1', userId: 1 },
      { id: 2, title: 'Note 2', note: 'Content 2', userId: 2 },
    ];

    mockPrisma.trainingNote.findMany.mockResolvedValueOnce(mockTrainingNotes);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.trainingNote.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockTrainingNotes);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockPrisma.trainingNote.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Database error');
    expect(prisma.trainingNote.findMany).toHaveBeenCalled();
  });
});

describe('TrainingNoteService - findOne', () => {
  let service: TrainingNoteService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    trainingNote: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingNoteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a training note when found', async () => {
    // Arrange
    const id = 1;
    const mockTrainingNote = {
      id,
      title: 'Training Note 1',
      note: 'This is a test note',
      userId: 1,
    };

    mockPrisma.trainingNote.findUnique.mockResolvedValueOnce(mockTrainingNote);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.trainingNote.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(mockTrainingNote);
  });

  it('should return null if the training note is not found', async () => {
    // Arrange
    const id = 999;
    mockPrisma.trainingNote.findUnique.mockResolvedValueOnce(null);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.trainingNote.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeNull();
  });

  it('should propagate an error if findUnique fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');
    mockPrisma.trainingNote.findUnique.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Database error');

    expect(prisma.trainingNote.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });
});

describe('TrainingNoteService - update', () => {
  let service: TrainingNoteService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    trainingNote: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingNoteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update a training note', async () => {
    // Arrange
    const id = 1;
    const updateDto: UpdateTrainingNoteDto = {
      title: 'Updated Title',
      note: 'Updated Note',
    };

    const updatedTrainingNote = {
      id,
      title: 'Updated Title',
      note: 'Updated Note',
      userId: 1,
    };

    mockPrisma.trainingNote.update.mockResolvedValueOnce(updatedTrainingNote);

    // Act
    const result = await service.update(id, updateDto);

    // Assert
    expect(prisma.trainingNote.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        title: 'Updated Title',
        note: 'Updated Note',
      },
    });

    expect(result).toEqual(updatedTrainingNote);
  });

  it('should update only the fields provided in UpdateTrainingNoteDto', async () => {
    // Arrange
    const id = 1;
    const updateDto: UpdateTrainingNoteDto = {
      note: 'Updated Note Only',
    };

    const updatedTrainingNote = {
      id,
      title: 'Existing Title',
      note: 'Updated Note Only',
      userId: 1,
    };

    mockPrisma.trainingNote.update.mockResolvedValueOnce(updatedTrainingNote);

    // Act
    const result = await service.update(id, updateDto);

    // Assert
    expect(prisma.trainingNote.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        note: 'Updated Note Only',
      },
    });

    expect(result).toEqual(updatedTrainingNote);
  });

  it('should throw an error if training note to update is not found', async () => {
    // Arrange
    const id = 999;
    const updateDto: UpdateTrainingNoteDto = {
      title: 'Non-existent',
      note: 'Non-existent Note',
    };

    const mockError = new Error('Training note not found');
    mockPrisma.trainingNote.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateDto)).rejects.toThrow(
      'Training note not found',
    );

    expect(prisma.trainingNote.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        title: 'Non-existent',
        note: 'Non-existent Note',
      },
    });
  });

  it('should propagate a generic error if update fails', async () => {
    // Arrange
    const id = 1;
    const updateDto: UpdateTrainingNoteDto = {
      title: 'Error Test',
    };

    const mockError = new Error('Database error');
    mockPrisma.trainingNote.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateDto)).rejects.toThrow('Database error');

    expect(prisma.trainingNote.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        title: 'Error Test',
      },
    });
  });
});

describe('TrainingNoteService - remove', () => {
  let service: TrainingNoteService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    trainingNote: {
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingNoteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrainingNoteService>(TrainingNoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully delete a training note', async () => {
    // Arrange
    const id = 1;
    const mockDeletedTrainingNote = {
      id: 1,
      title: 'Deleted Note',
      note: 'This note has been deleted.',
      userId: 1,
    };

    mockPrisma.trainingNote.delete.mockResolvedValueOnce(mockDeletedTrainingNote);

    // Act
    const result = await service.remove(id);

    // Assert
    expect(prisma.trainingNote.delete).toHaveBeenCalledWith({
      where: { id },
    });

    expect(result).toEqual(mockDeletedTrainingNote);
  });

  it('should throw an error if the training note does not exist', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Record not found');

    mockPrisma.trainingNote.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Record not found');

    expect(prisma.trainingNote.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should propagate a generic error if deletion fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.trainingNote.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Database error');

    expect(prisma.trainingNote.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});