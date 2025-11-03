import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector, APP_GUARD } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../authentication/authentication.guard';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import * as HandleErrors from '../utils/handle-errors';

describe('NotesController', () => {
  let controller: NotesController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: {
            trainingNote: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          }
        },
        Reflector, // Reflector is required for guards
        {
          provide: APP_GUARD,
          useClass: AuthGuard, // Use a mocked AuthGuard
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new note and return NotesEntity', async () => {
      const mockDto = {
        title: 'Test Note',
        note: 'This is a test note',
      };
      const mockUser = { sub: 1 };
      const mockNote = {
        id: 1,
        title: mockDto.title,
        note: mockDto.note,
        userId: mockUser.sub,
        createdAt: new Date(),
        workoutId: null,
        workoutProgramId: null,
        exerciseId: null,
      };

      const mockNotesService = module.get<NotesService>(NotesService);
      jest.spyOn(mockNotesService, 'create').mockResolvedValue(mockNote);

      const result = await controller.create(mockDto as any, mockUser as any);

      expect(mockNotesService.create).toHaveBeenCalledWith(mockUser.sub, mockDto);
      expect(result).toEqual(expect.objectContaining({ id: mockNote.id, title: mockDto.title }));
    });
  });

  describe('findAll', () => {
    it('should return an array of NotesEntity', async () => {
      const mockNotes = [
        { id: 1, title: 'Note 1', note: 'Content 1', userId: 1, createdAt: new Date() },
        { id: 2, title: 'Note 2', note: 'Content 2', userId: 1, createdAt: new Date() },
      ];

      const mockNotesService = module.get<NotesService>(NotesService);
      jest.spyOn(mockNotesService, 'findAll').mockResolvedValue(mockNotes as any);

      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(expect.objectContaining({ id: mockNotes[0].id }));
    });
  });

  describe('other endpoints & error handling', () => {
  let mockNotesService: NotesService;
  let handleErrorsSpy: jest.SpyInstance;

  beforeEach(() => {
    mockNotesService = module.get<NotesService>(NotesService);
    handleErrorsSpy = jest.spyOn(HandleErrors, 'handleErrors').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a single note (findOne)', async () => {
    const mockNote = {
      id: 5,
      title: 'Single note',
      note: 'content',
      userId: 1,
      createdAt: new Date(),
      workoutId: null,
      workoutProgramId: null,
      exerciseId: null,
    };

    jest.spyOn(mockNotesService, 'findOne').mockResolvedValueOnce(mockNote as any);

    const result = await controller.findOne('5');

    // controller wraps in NotesEntity
    expect(mockNotesService.findOne).toHaveBeenCalledWith(5);
    expect(result).toEqual(expect.objectContaining({ id: mockNote.id, title: mockNote.title }));
  });

  it('should update a note and return NotesEntity', async () => {
    const id = 6;
    const updateDto = { title: 'Updated title', note: 'Updated' };
    const mockUpdated = {
      id,
      title: updateDto.title,
      note: updateDto.note,
      userId: 1,
      createdAt: new Date(),
      workoutId: null,
      workoutProgramId: null,
      exerciseId: null,
    };

    jest.spyOn(mockNotesService, 'update').mockResolvedValueOnce(mockUpdated as any);

    const result = await controller.update(id.toString(), updateDto as any);

    expect(mockNotesService.update).toHaveBeenCalledWith(id, updateDto);
    expect(result).toEqual(expect.objectContaining({ id: mockUpdated.id, title: mockUpdated.title }));
  });

  it('should remove a note and return NotesEntity', async () => {
    const id = 7;
    const mockDeleted = {
      id,
      title: 'To delete',
      note: 'x',
      userId: 1,
      createdAt: new Date(),
      workoutId: null,
      workoutProgramId: null,
      exerciseId: null,
    };

    jest.spyOn(mockNotesService, 'remove').mockResolvedValueOnce(mockDeleted as any);

    const result = await controller.remove(id.toString());

    expect(mockNotesService.remove).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: mockDeleted.id }));
  });

  it('should call handleErrors when create throws', async () => {
    const mockDto = { title: 'Err Note', note: 'error' };
    const mockUser = { sub: 1 };

    const error = new Error('create failed');
    jest.spyOn(mockNotesService, 'create').mockRejectedValueOnce(error);

    // call create (controller catches and calls handleErrors)
    await controller.create(mockDto as any, mockUser as any);

    expect(mockNotesService.create).toHaveBeenCalledWith(mockUser.sub, mockDto);
    expect(handleErrorsSpy).toHaveBeenCalledWith(error);
  });
});
});