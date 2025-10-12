import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../decorators/user.decorator';
import { handleErrors } from '../utils/handle-errors';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { AuthGuard } from '../authentication/authentication.guard';
import { ApiResponseBody } from '../responses/ApiResponse';

import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';
import { NotesEntity } from './entities/notes.entity';


@Controller('notes')
@UseGuards(AuthGuard)
@ApiTags('Notes')
export class NotesController {
  constructor(private readonly NotesService: NotesService) {}

  @Post()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create Training Note', description: 'Create a new training note for one of you workout plan' })
  @ApiBody({ type: CreateNotesDto })
  @ApiResponse({ status: 201, description: 'Created', type: NotesEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
      @Body() CreateNotesDto: CreateNotesDto,
      @User() user: JwtPayload,
    ) {
      try {
          return this.NotesService.create(
            user.sub,
            CreateNotesDto
          );
      } catch (err: unknown) {
        handleErrors(err);
      }
  }

  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get All Training Notes', description: 'Get all training notes for one of you workout plan' })
  @ApiResponse({ status: 200, description: 'OK', type: [NotesEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll() {
    return this.NotesService.findAll();
  }

  @Get(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get a specific Training Notes', description: 'Get a training notes for one of you workout plan' })
  @ApiResponse({ status: 200, description: 'OK', type: NotesEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findOne(@Param('id') id: string) {
    return this.NotesService.findOne(+id);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change a Training Notes', description: 'Change information of a  training notes' })
  @ApiResponse({ status: 200, description: 'OK', type: NotesEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Body() UpdateNotesDto: UpdateNotesDto) {
    return this.NotesService.update(+id, UpdateNotesDto);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete a Training Notes', description: 'Delete a  training notes' })
  @ApiResponse({ status: 200, description: 'OK', type: NotesEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(@Param('id') id: string) {
    return this.NotesService.remove(+id);
  }
}
