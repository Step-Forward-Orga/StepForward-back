import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TrainingNoteModule } from './training-note/training-note.module';
import { ExerciceModule } from './exercice/exercice.module';

@Module({
  imports: [PrismaModule, UserModule, AuthenticationModule, TrainingNoteModule, ExerciceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
