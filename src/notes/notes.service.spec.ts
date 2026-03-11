import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from'../prisma/prisma.service';

import { NotesService } from './notes.service';
import { UpdateNotesDto } from './dto/update-notes.dto';

describe('NotesService - create', () => {
  let service: NotesService;
  let prisma: PrismaService;
  const mockPrisma = {
    notes: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirstOrThrow: jest.fn(),
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
    const id = 1;
    const userId = 1;
    const mockNote = {
      id,
      title: 'My First Note',
      note: 'This is my note.',
      userId,
    };

    mockPrisma.notes.create.mockResolvedValueOnce(mockNote);
    const result = await service.create(userId, mockNote);
    expect(prisma.notes.create).toHaveBeenCalledWith({
      data: {
        title: mockNote.title,
        note: mockNote.note,
        user: { connect: { id: userId } },
      },
    });
    expect(result).toEqual(mockNote);
  });

  it('should create a note linked to a workout when workoutId is provided', async () => {
  const userId = 1;
  const dtoWithWorkout = {
    title: 'Note with workout',
    note: 'linked to workout',
    workoutId: 42,
  };
  const mockNote = {
    id: 10,
    title: dtoWithWorkout.title,
    note: dtoWithWorkout.note,
    userId,
    workoutId: dtoWithWorkout.workoutId,
  };

  mockPrisma.notes.create.mockResolvedValueOnce(mockNote);
  const result = await service.create(userId, dtoWithWorkout as any);
  expect(prisma.notes.create).toHaveBeenCalledWith({
    data: {
      title: dtoWithWorkout.title,
      note: dtoWithWorkout.note,
      user: { connect: { id: userId } },
      workout: { connect: { id: dtoWithWorkout.workoutId } },
      workoutProgram: undefined,
      workoutExercise: undefined,
    },
  });
  expect(result).toEqual(mockNote);
});

it('should create a note linked to a workoutProgram when workoutProgramId is provided', async () => {
  const userId = 2;
  const dtoWithProgram = {
    title: 'Note with program',
    note: 'linked to program',
    workoutProgramId: 7,
  };
  const mockNote = {
    id: 11,
    title: dtoWithProgram.title,
    note: dtoWithProgram.note,
    userId,
    workoutProgramId: dtoWithProgram.workoutProgramId,
  };

  mockPrisma.notes.create.mockResolvedValueOnce(mockNote);
  const result = await service.create(userId, dtoWithProgram as any);
  expect(prisma.notes.create).toHaveBeenCalledWith({
    data: {
      title: dtoWithProgram.title,
      note: dtoWithProgram.note,
      user: { connect: { id: userId } },
      workout: undefined,
      workoutProgram: { connect: { id: dtoWithProgram.workoutProgramId } },
      workoutExercise: undefined,
    },
  });
  expect(result).toEqual(mockNote);
});

it('should create a note linked to an exercise when exerciseId is provided', async () => {
  const userId = 3;
  const dtoWithExercise = {
    title: 'Note with exercise',
    note: 'linked to exercise',
    workoutExerciseId: 99,
  };
  const mockNote = {
    id: 12,
    title: dtoWithExercise.title,
    note: dtoWithExercise.note,
    userId,
    workoutExerciseId: dtoWithExercise.workoutExerciseId,
  };

  mockPrisma.notes.create.mockResolvedValueOnce(mockNote);
  const result = await service.create(userId, dtoWithExercise as any);
  expect(prisma.notes.create).toHaveBeenCalledWith({
    data: {
      title: dtoWithExercise.title,
      note: dtoWithExercise.note,
      user: { connect: { id: userId } },
      workout: undefined,
      workoutProgram: undefined,
      workoutExercise: { connect: { id: dtoWithExercise.workoutExerciseId } },
    },
  });
  expect(result).toEqual(mockNote);
});

it('should create a note with multiple relations when multiple ids are provided', async () => {
  const userId = 4;
  const dtoAll = {
    title: 'Note full',
    note: 'linked to workout, program and exercise',
    workoutId: 101,
    workoutProgramId: 202,
    workoutExerciseId: 303,
  };
  const mockNote = {
    id: 13,
    title: dtoAll.title,
    note: dtoAll.note,
    userId,
    workoutId: dtoAll.workoutId,
    workoutProgramId: dtoAll.workoutProgramId,
    workoutExerciseId: dtoAll.workoutExerciseId,
  };

  mockPrisma.notes.create.mockResolvedValueOnce(mockNote);
  const result = await service.create(userId, dtoAll as any);
  expect(prisma.notes.create).toHaveBeenCalledWith({
    data: {
      title: dtoAll.title,
      note: dtoAll.note,
      user: { connect: { id: userId } },
      workout: { connect: { id: dtoAll.workoutId } },
      workoutProgram: { connect: { id: dtoAll.workoutProgramId } },
      workoutExercise: { connect: { id: dtoAll.workoutExerciseId } },
    },
  });
  expect(result).toEqual(mockNote);
});

  it('should throw an error if note creation fails', async () => {
    const id = 1;
    const userId = 1;
    const mockNote = {
      id,
      title: 'My Failed Note',
      note: 'This will fail.',
      userId,
    };
    const mockError = new Error('Database connection failed');

    mockPrisma.notes.create.mockRejectedValueOnce(mockError);
    await expect(service.create(userId, mockNote)).rejects.toThrow(
      'Database connection failed',
    );
    expect(prisma.notes.create).toHaveBeenCalledWith({
      data: {
        title: mockNote.title,
        note: mockNote.note,
        user: { connect: { id: userId } },
      },
    });
  });
});

describe('NotesService - findAll', () => {
  let service: NotesService;
  let prisma: PrismaService;
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
    const mockNotes = [
      { id: 1, title: 'Note 1', note: 'Content 1', userId: 1 },
      { id: 2, title: 'Note 2', note: 'Content 2', userId: 1 },
    ];

    mockPrisma.notes.findMany.mockResolvedValueOnce(mockNotes);
    const result = await service.findAll(1);
    expect(prisma.notes.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockNotes);
  });

  it('should propagate an error if findMany fails', async () => {
    const mockError = new Error('Database error');
    mockPrisma.notes.findMany.mockRejectedValueOnce(mockError);

    await expect(service.findAll(1)).rejects.toThrow('Database error');
    expect(prisma.notes.findMany).toHaveBeenCalled();
  });
});

describe('NotesService - findOne', () => {
  let service: NotesService;
  let prisma: PrismaService;
  const mockPrisma = {
    notes: {
      findUnique: jest.fn(),
      findFirstOrThrow: jest.fn(),
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
    const id = 1;
    const userId = 1;
    const mockNote = {
      id,
      title: 'Training Note 1',
      note: 'This is a test note',
      userId,
    };

    mockPrisma.notes.findFirstOrThrow.mockResolvedValueOnce(mockNote);
    const result = await service.findOne(id, userId);
    expect(prisma.notes.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: id, userId: userId }
    });
    expect(result).toEqual(mockNote);
  });

  it('should return null if the note is not found', async () => {
    const id = 999;
    const userId = 1;

    mockPrisma.notes.findFirstOrThrow.mockResolvedValueOnce(null);
    const result = await service.findOne(id, userId);
    expect(prisma.notes.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id, userId },
    });
    expect(result).toBeNull();
  });

  it('should propagate an error if findUnique fails', async () => {
    const id = 1;
    const userId = 1;
    const mockError = new Error('Database error');

    mockPrisma.notes.findFirstOrThrow.mockRejectedValueOnce(mockError);
    await expect(service.findOne(id, userId)).rejects.toThrow('Database error');
    expect(prisma.notes.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id, userId },
    });
  });
});

describe('NotesService - update', () => {
  let service: NotesService;
  let prisma: PrismaService;

  const mockPrisma = {
    notes: {
      findFirst: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('should successfully update a note', async () => {
    const id = 1;
    const userId = 1;
    const existingNote = {
      id,
      title: 'Old Title',
      note: 'Old Note',
      userId,
    };
    const updateDto: UpdateNotesDto = {
      title: 'Updated Title',
      note: 'Updated Note',
    };
    const updatedNotes = {
      title: 'Updated Title',
      note: 'Updated Note',
    };

    mockPrisma.notes.findFirst.mockResolvedValueOnce(existingNote);
    mockPrisma.notes.update.mockResolvedValueOnce(updatedNotes);
    const result = await service.update(id, updateDto, userId);
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
    expect(prisma.notes.update).toHaveBeenCalledWith({
      data: {
        title: 'Updated Title',
        note: 'Updated Note',
      },
      where: {
        id,
      },
    });
    expect(result).toEqual(updatedNotes);
  });

  it('should update only the fields provided in UpdateNotesDto', async () => {
    const id = 1;
    const userId = 1;
    const existingNote = {
      id,
      title: 'Old Title',
      note: 'Old Note',
      userId,
    };
    const updateDto: UpdateNotesDto = {
      note: 'Updated Note Only',
    };
    const updatedNotes = {
      id,
      title: 'Existing Title',
      note: 'Updated Note Only',
      userId,
    };

    mockPrisma.notes.findFirst.mockResolvedValueOnce(existingNote);
    mockPrisma.notes.update.mockResolvedValueOnce(updatedNotes);
    const result = await service.update(id, updateDto, updatedNotes.userId);
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
    expect(prisma.notes.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        note: 'Updated Note Only',
      },
    });
    expect(result).toEqual(updatedNotes);
  });

  it('should throw an error if note to update is not found', async () => {
    const id = 999;
    const userId = 1;
    const updateDto: UpdateNotesDto = {
      title: 'Non-existent',
      note: 'Non-existent Note',
    };

    mockPrisma.notes.findFirst.mockResolvedValueOnce(null);
    await expect(service.update(id, updateDto, userId)).rejects.toThrow('Note not found');
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
    expect(prisma.notes.update).not.toHaveBeenCalled();
  });

  it('should propagate a generic error if update fails', async () => {
    const id = 1;
    const userId = 1;
    const updateDto: UpdateNotesDto = {
      title: 'Error Test',
    };
    const existingNote = {
      id,
      title: 'Old Title',
      note: 'Old Note',
      userId,
    };
    const mockError = new Error('Database error');

    mockPrisma.notes.findFirst.mockResolvedValueOnce(existingNote);
    mockPrisma.notes.update.mockRejectedValueOnce(mockError);
    await expect(service.update(id, updateDto, userId)).rejects.toThrow('Database error');
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
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
  const mockPrisma = {
    notes: {
      delete: jest.fn(),
      findFirst: jest.fn()
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
    jest.clearAllMocks();
  });

  it('should successfully delete a note', async () => {
    const id = 1;
    const userId = 1;
    const mockDeletedNotes = {
      id,
      title: 'Deleted Note',
      note: 'This note has been deleted.',
      userId,
    };

    mockPrisma.notes.findFirst.mockResolvedValueOnce(mockDeletedNotes);
    mockPrisma.notes.delete.mockResolvedValueOnce(mockDeletedNotes);
    const result = await service.remove(id, userId);
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
    expect(prisma.notes.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(mockDeletedNotes);
  });

  it('should throw an error if the note does not exist', async () => {
    const id = 999;
    const userId = 1;

    mockPrisma.notes.findFirst.mockResolvedValueOnce
    await expect(service.remove(id, userId)).rejects.toThrow('Note not found');
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    })
    expect(prisma.notes.delete).not.toHaveBeenCalled();
  });

  it('should propagate a generic error if deletion fails', async () => {
    const id = 1;
    const userId = 1;
    const mockError = new Error('Note not found');

    mockPrisma.notes.findFirst.mockResolvedValueOnce(null);
    mockPrisma.notes.delete.mockRejectedValueOnce(mockError);
    await expect(service.remove(id, userId)).rejects.toThrow('Note not found');
    expect(prisma.notes.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
    expect(prisma.notes.delete).not.toHaveBeenCalledWith({
      where: { id },
    });
  });
});