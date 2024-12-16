import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../decorators/user.decorator';
import { handleErrors } from '../utils/handle-errors';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { AuthGuard } from '../authentication/authentication.guard';
import { ApiResponseBody } from '../responses/ApiResponse';

import { TrainingNoteService } from './training-note.service';
import { CreateTrainingNoteDto } from './dto/create-training-note.dto';
import { UpdateTrainingNoteDto } from './dto/update-training-note.dto';
import { TrainingNoteEntity } from './entities/training-note.entity';


@Controller('training-note')
@UseGuards(AuthGuard)
@ApiTags('Training Notes')
export class TrainingNoteController {
  constructor(private readonly trainingNoteService: TrainingNoteService) {}

  @Post()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create Training Note', description: 'Create a new training note for one of you workout plan' })
  @ApiBody({ type: CreateTrainingNoteDto })
  @ApiResponse({ status: 201, description: 'Created', type: TrainingNoteEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
      @Body() createTrainingNoteDto: CreateTrainingNoteDto,
      @User() user: JwtPayload,
    ) {
      try {
          return this.trainingNoteService.create(
            user.sub,
            createTrainingNoteDto.title,
            createTrainingNoteDto.note,
          );
      } catch (err: unknown) {
        handleErrors(err);
      }
  }

  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get All Training Notes', description: 'Get all training notes for one of you workout plan' })
  @ApiResponse({ status: 200, description: 'OK', type: [TrainingNoteEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll() {
    return this.trainingNoteService.findAll();
  }

  @Get(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get a specific Training Notes', description: 'Get a training notes for one of you workout plan' })
  @ApiResponse({ status: 200, description: 'OK', type: TrainingNoteEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findOne(@Param('id') id: string) {
    return this.trainingNoteService.findOne(+id);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change a Training Notes', description: 'Change information of a  training notes' })
  @ApiResponse({ status: 200, description: 'OK', type: TrainingNoteEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Body() updateTrainingNoteDto: UpdateTrainingNoteDto) {
    return this.trainingNoteService.update(+id, updateTrainingNoteDto);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete a Training Notes', description: 'Delete a  training notes' })
  @ApiResponse({ status: 200, description: 'OK', type: TrainingNoteEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiResponseBody})
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(@Param('id') id: string) {
    return this.trainingNoteService.remove(+id);
  }
}
