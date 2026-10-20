import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// Shared by main.ts and the e2e tests so both run the same pipes
export function configureApp(app: INestApplication) {
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // strips unknown body fields, e.g. a forged userId on update
      transformOptions: { enableImplicitConversion: false },
    }),
  );
}
