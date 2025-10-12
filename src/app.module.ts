import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NotesModule } from './notes/notes.module';
import { ExerciseModule } from './exercise/exercise.module';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [
    PrismaModule, UserModule, AuthenticationModule, NotesModule, ExerciseModule, WorkoutModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
