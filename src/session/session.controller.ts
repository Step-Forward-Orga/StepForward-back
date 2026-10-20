import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../authentication/authentication.guard';
import { User } from '../decorators/user.decorator';
import { JwtPayload } from '../authentication/contracts/JwtPayload.interface';
import { handleErrors } from '../utils/handle-errors';

import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { GetSessionsQueryDto } from './dto/get-sessions-query.dto';
import { AddSessionExerciseDto, UpdateSessionExerciseDto } from './dto/session-exercise.dto';
import { LogSetDto, UpdateLoggedSetDto } from './dto/logged-set.dto';

// Logged workouts: a session holds exercises, each exercise holds the sets actually done
@Controller('session')
@UseGuards(AuthGuard)
@ApiTags('Session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // run a service call, mapping Prisma errors (e.g. not owned -> 404)
  private async handle<T>(call: Promise<T>) {
    try {
      return await call;
    } catch (error: unknown) {
      handleErrors(error);
    }
  }

  @Post()
  start(@User() user: JwtPayload, @Body() createSessionDto: CreateSessionDto) {
    return this.handle(this.sessionService.start(user.sub, createSessionDto));
  }

  @Get()
  findAll(@User() user: JwtPayload, @Query() query: GetSessionsQueryDto) {
    return this.handle(this.sessionService.findAll(user.sub, query));
  }

  @Get(':id')
  findOne(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.handle(this.sessionService.findOne(id, user.sub));
  }

  @Patch(':id')
  update(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() updateSessionDto: UpdateSessionDto) {
    return this.handle(this.sessionService.update(id, user.sub, updateSessionDto));
  }

  @Delete(':id')
  remove(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.handle(this.sessionService.remove(id, user.sub));
  }

  @Post(':id/exercise')
  addExercise(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() addSessionExerciseDto: AddSessionExerciseDto) {
    return this.handle(this.sessionService.addExercise(id, user.sub, addSessionExerciseDto));
  }

  @Patch('exercise/:id')
  updateExercise(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() updateSessionExerciseDto: UpdateSessionExerciseDto) {
    return this.handle(this.sessionService.updateExercise(id, user.sub, updateSessionExerciseDto));
  }

  @Delete('exercise/:id')
  removeExercise(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.handle(this.sessionService.removeExercise(id, user.sub));
  }

  @Post('exercise/:id/set')
  logSet(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() logSetDto: LogSetDto) {
    return this.handle(this.sessionService.logSet(id, user.sub, logSetDto));
  }

  @Patch('set/:id')
  updateSet(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() updateLoggedSetDto: UpdateLoggedSetDto) {
    return this.handle(this.sessionService.updateSet(id, user.sub, updateLoggedSetDto));
  }

  @Delete('set/:id')
  removeSet(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.handle(this.sessionService.removeSet(id, user.sub));
  }
}
