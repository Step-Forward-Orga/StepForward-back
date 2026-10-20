import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

export async function createApp() {
  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}

let userCount = 0;

// Signs up a fresh user and returns the Cookie header to authenticate with.
// The auth cookies are `Secure`, which supertest won't replay over http, so we pass them by hand.
export async function signUp(app: INestApplication, name = 'user') {
  const username = `${name}${Date.now()}${userCount++}`;
  const response = await request(app.getHttpServer())
    .post('/authentication/sign-up')
    .send({ email: `${username}@e2e.test`, username, password: 'Password123!' })
    .expect(201);
  const cookies = [response.headers['set-cookie']].flat() as string[];
  return {
    id: response.body.id as number,
    cookie: cookies.map((cookie) => cookie.split(';')[0]).join('; '),
  };
}
