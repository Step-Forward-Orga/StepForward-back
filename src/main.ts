import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: ['log', 'error', 'warn', 'debug', 'verbose']});

  app.enableCors({
    credentials: true,
    origin:
      (process.env.NODE_ENV === 'prod'
      ? (process.env.FRONT_URL as string)
      : ( process.env.NODE_ENV === 'staging' ? (process.env.FRONT_URL as string) : `*`))
  })
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('StepForward')
    .setDescription('API documentation for StepForward API.')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
