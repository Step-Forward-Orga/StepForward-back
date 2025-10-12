import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from'../prisma/prisma.service';

import { NotesService } from './notes.service';
import { UpdateNotesDto } from './dto/update-notes.dto';

describe('NotesService - create', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    notes: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully create a note', async () => {
    // Arrange
    const authorId = 1;
    const title = 'My First Note';
    const note = 'This is my note.';

    const mockCreatedNote = {
      id: 1,
      title,
      note,
      userId: authorId,
    };

    mockPrisma.notes.create.mockResolvedValueOnce(mockCreatedNote);

    // Act
    const result = await service.create(authorId, mockCreatedNote);

    // Assert
    expect(prisma.notes.create).toHaveBeenCalledWith({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
      },
    });

    expect(result).toEqual(mockCreatedNote);
  });

  it('should throw an error if note creation fails', async () => {
    // Arrange
    const authorId = 1;
    const title = 'My Failed Note';
    const note = 'This will fail.';

    const mockCreatedNote = {
      id: 1,
      title,
      note,
      userId: authorId,
    };

    const mockError = new Error('Database connection failed');

    mockPrisma.notes.create.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.create(authorId, mockCreatedNote)).rejects.toThrow(
      'Database connection failed',
    );

    expect(prisma.notes.create).toHaveBeenCalledWith({
      data: {
        title,
        note,
        user: { connect: { id: authorId } },
      },
    });
  });
});

describe('NotesService - findAll', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    notes: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all notes successfully', async () => {
    // Arrange
    const mockNotess = [
      { id: 1, title: 'Note 1', note: 'Content 1', userId: 1 },
      { id: 2, title: 'Note 2', note: 'Content 2', userId: 2 },
    ];

    mockPrisma.notes.findMany.mockResolvedValueOnce(mockNotess);

    // Act
    const result = await service.findAll();

    // Assert
    expect(prisma.notes.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockNotess);
  });

  it('should propagate an error if findMany fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    mockPrisma.notes.findMany.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findAll()).rejects.toThrow('Database error');
    expect(prisma.notes.findMany).toHaveBeenCalled();
  });
});

describe('NotesService - findOne', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    notes: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a note when found', async () => {
    // Arrange
    const id = 1;
    const mockNotes = {
      id,
      title: 'Training Note 1',
      note: 'This is a test note',
      userId: 1,
    };

    mockPrisma.notes.findUnique.mockResolvedValueOnce(mockNotes);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.notes.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(mockNotes);
  });

  it('should return null if the note is not found', async () => {
    // Arrange
    const id = 999;
    mockPrisma.notes.findUnique.mockResolvedValueOnce(null);

    // Act
    const result = await service.findOne(id);

    // Assert
    expect(prisma.notes.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeNull();
  });

  it('should propagate an error if findUnique fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');
    mockPrisma.notes.findUnique.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.findOne(id)).rejects.toThrow('Database error');

    expect(prisma.notes.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });
});

describe('NotesService - update', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    notes: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully update a note', async () => {
    // Arrange
    const id = 1;
    const updateDto: UpdateNotesDto = {
      title: 'Updated Title',
      note: 'Updated Note',
    };

    const updatedNotes = {
      id,
      title: 'Updated Title',
      note: 'Updated Note',
      userId: 1,
    };

    mockPrisma.notes.update.mockResolvedValueOnce(updatedNotes);

    // Act
    const result = await service.update(id, updateDto);

    // Assert
    expect(prisma.notes.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        title: 'Updated Title',
        note: 'Updated Note',
      },
    });

    expect(result).toEqual(updatedNotes);
  });

  it('should update only the fields provided in UpdateNotesDto', async () => {
    // Arrange
    const id = 1;
    const updateDto: UpdateNotesDto = {
      note: 'Updated Note Only',
    };

    const updatedNotes = {
      id,
      title: 'Existing Title',
      note: 'Updated Note Only',
      userId: 1,
    };

    mockPrisma.notes.update.mockResolvedValueOnce(updatedNotes);

    // Act
    const result = await service.update(id, updateDto);

    // Assert
    expect(prisma.notes.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        note: 'Updated Note Only',
      },
    });

    expect(result).toEqual(updatedNotes);
  });

  it('should throw an error if note to update is not found', async () => {
    // Arrange
    const id = 999;
    const updateDto: UpdateNotesDto = {
      title: 'Non-existent',
      note: 'Non-existent Note',
    };

    const mockError = new Error('Note not found');
    mockPrisma.notes.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateDto)).rejects.toThrow(
      'Note not found',
    );

    expect(prisma.notes.update).toHaveBeenCalledWith({
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
    const updateDto: UpdateNotesDto = {
      title: 'Error Test',
    };

    const mockError = new Error('Database error');
    mockPrisma.notes.update.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.update(id, updateDto)).rejects.toThrow('Database error');

    expect(prisma.notes.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        title: 'Error Test',
      },
    });
  });
});

describe('NotesService - remove', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrisma = {
    notes: {
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should successfully delete a note', async () => {
    // Arrange
    const id = 1;
    const mockDeletedNotes = {
      id: 1,
      title: 'Deleted Note',
      note: 'This note has been deleted.',
      userId: 1,
    };

    mockPrisma.notes.delete.mockResolvedValueOnce(mockDeletedNotes);

    // Act
    const result = await service.remove(id);

    // Assert
    expect(prisma.notes.delete).toHaveBeenCalledWith({
      where: { id },
    });

    expect(result).toEqual(mockDeletedNotes);
  });

  it('should throw an error if the note does not exist', async () => {
    // Arrange
    const id = 999;
    const mockError = new Error('Record not found');

    mockPrisma.notes.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Record not found');

    expect(prisma.notes.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should propagate a generic error if deletion fails', async () => {
    // Arrange
    const id = 1;
    const mockError = new Error('Database error');

    mockPrisma.notes.delete.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(service.remove(id)).rejects.toThrow('Database error');

    expect(prisma.notes.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});