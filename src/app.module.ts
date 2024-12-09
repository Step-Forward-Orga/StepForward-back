import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TrainingNoteController } from './training-note/training-note.controller';
import { TrainingNoteModule } from './training-note/training-note.module';
import { ExerciceService } from './exercice/exercice.service';
import { ExerciceModule } from './exercice/exercice.module';
import { ExerciceModule } from './exercice/exercice.module';

@Module({
  imports: [PrismaModule, UserModule, AuthenticationModule, TrainingNoteModule, ExerciceModule],
  controllers: [AppController],
  providers: [AppService, ExerciceService],
})
export class AppModule {}
