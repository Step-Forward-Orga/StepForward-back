import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createApp, signUp } from './helpers';

type User = { id: number; cookie: string };

// Full training flow against a real database: plan a workout, log sessions, read the progression
describe('Sessions (e2e)', () => {
  let app: INestApplication;
  let owner: User;
  let stranger: User;

  const as = (user: User) => {
    const server = app.getHttpServer();
    return {
      get: (path: string) => request(server).get(path).set('Cookie', user.cookie),
      post: (path: string, body: object = {}) => request(server).post(path).set('Cookie', user.cookie).send(body),
      patch: (path: string, body: object) => request(server).patch(path).set('Cookie', user.cookie).send(body),
      delete: (path: string) => request(server).delete(path).set('Cookie', user.cookie),
    };
  };

  // filled by the flow below, in order
  let exerciseId: number;
  let workoutId: number;
  let sessionId: number;
  let sessionExerciseId: number;
  let setId: number;

  beforeAll(async () => {
    app = await createApp();
    owner = await signUp(app, 'owner');
    stranger = await signUp(app, 'stranger');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('planning', () => {
    it('creates a private exercise', async () => {
      const { body } = await as(owner).post('/Exercise', { name: 'Bench Press' }).expect(201);
      expect(body.userId).toBe(owner.id);
      exerciseId = body.id;
    });

    it('creates a workout with a planned exercise and a rep range', async () => {
      workoutId = (await as(owner).post('/workout', { title: 'Upper 1' }).expect(201)).body.id;

      const { body } = await as(owner)
        .post('/workout-exercise', {
          workoutId,
          exerciseId,
          restTime: 'PT3M',
          plannedSets: [
            { order: 1, repsMin: 6, repsMax: 8, weight: 80 },
            { order: 2, repsMin: 10, repsMax: 10, weight: 65 },
          ],
        })
        .expect(201);
      expect(body.plannedSets).toHaveLength(2);
    });

    it('rejects an inverted rep range', async () => {
      await as(owner)
        .post('/workout-exercise', {
          workoutId,
          exerciseId,
          restTime: 'PT3M',
          plannedSets: [{ order: 1, repsMin: 10, repsMax: 8 }],
        })
        .expect(400);
    });
  });

  describe('logging a session', () => {
    it('starts from the template with the planned targets attached', async () => {
      const { body } = await as(owner).post('/session', { workoutId }).expect(201);

      expect(body).toMatchObject({ title: 'Upper 1', workoutId, finishedAt: null });
      expect(body.exercises).toHaveLength(1);
      expect(body.exercises[0].exercise.name).toBe('Bench Press');
      expect(body.exercises[0].workoutExercise.plannedSets.map((set) => [set.repsMin, set.repsMax])).toEqual([
        [6, 8],
        [10, 10],
      ]);
      sessionId = body.id;
      sessionExerciseId = body.exercises[0].id;
    });

    it('logs sets in order, with a note', async () => {
      setId = (await as(owner).post(`/session/exercise/${sessionExerciseId}/set`, { reps: 8, weight: 80, note: 'easy' }).expect(201)).body.id;
      await as(owner).post(`/session/exercise/${sessionExerciseId}/set`, { reps: 10, weight: 65 }).expect(201);

      const { body } = await as(owner).get(`/session/${sessionId}`).expect(200);
      expect(body.exercises[0].sets.map((set) => [set.order, set.reps, set.weight, set.note])).toEqual([
        [1, 8, 80, 'easy'],
        [2, 10, 65, null],
      ]);
    });

    it('validates logged sets and strips unknown fields', async () => {
      await as(owner).post(`/session/exercise/${sessionExerciseId}/set`, { reps: -1, weight: 80 }).expect(400);

      const { body } = await as(owner).patch(`/session/set/${setId}`, { reps: 7, sessionExerciseId: 999 }).expect(200);
      expect(body).toMatchObject({ reps: 7, sessionExerciseId });
    });

    it('adds an exercise that was not planned', async () => {
      const curl = (await as(owner).post('/Exercise', { name: 'Hammer Curl' }).expect(201)).body;

      const { body } = await as(owner).post(`/session/${sessionId}/exercise`, { exerciseId: curl.id, note: 'extra' }).expect(201);
      expect(body).toMatchObject({ order: 2, note: 'extra', workoutExerciseId: null });
    });

    it('finishes the session', async () => {
      const finishedAt = new Date().toISOString();
      const { body } = await as(owner).patch(`/session/${sessionId}`, { finishedAt, note: 'good energy' }).expect(200);
      expect(body).toMatchObject({ finishedAt, note: 'good energy' });
    });
  });

  describe('progression', () => {
    it('returns one history entry per session, oldest first', async () => {
      const second = (await as(owner).post('/session', { workoutId }).expect(201)).body;
      await as(owner).post(`/session/exercise/${second.exercises[0].id}/set`, { reps: 8, weight: 85 }).expect(201);
      // a session where the exercise was skipped is left out
      await as(owner).post('/session', { workoutId }).expect(201);

      const { body } = await as(owner).get(`/Exercise/${exerciseId}/history`).expect(200);

      expect(body.map((entry) => entry.sessionId)).toEqual([sessionId, second.id]);
      expect(body[0]).toMatchObject({ topSet: { reps: 7, weight: 80 }, volume: 7 * 80 + 10 * 65 });
      expect(body[1].estimatedOneRepMax).toBeGreaterThan(body[0].estimatedOneRepMax);
    });
  });

  describe('another user', () => {
    it('sees none of it', async () => {
      expect((await as(stranger).get('/session').expect(200)).body).toEqual([]);
      await as(stranger).get(`/session/${sessionId}`).expect(404);
      await as(stranger).get(`/Exercise/${exerciseId}/history`).expect(404);
    });

    it('cannot write into it', async () => {
      await as(stranger).post('/session', { workoutId }).expect(404);
      await as(stranger).patch(`/session/${sessionId}`, { note: 'hacked' }).expect(404);
      await as(stranger).post(`/session/${sessionId}/exercise`, { exerciseId }).expect(404);
      await as(stranger).post(`/session/exercise/${sessionExerciseId}/set`, { reps: 1, weight: 1 }).expect(404);
      await as(stranger).patch(`/session/set/${setId}`, { reps: 1 }).expect(404);
      await as(stranger).delete(`/session/set/${setId}`).expect(404);
      await as(stranger).delete(`/session/${sessionId}`).expect(404);
    });

    it('gets errors without database details', async () => {
      const { body } = await as(stranger).patch(`/session/${sessionId}`, { note: 'hacked' }).expect(404);
      expect(JSON.stringify(body)).not.toMatch(/prisma|invocation|\/src\//i);
    });

    it('cannot use a private exercise of the owner', async () => {
      const ownSession = (await as(stranger).post('/session').expect(201)).body;
      await as(stranger).post(`/session/${ownSession.id}/exercise`, { exerciseId }).expect(404);
    });
  });

  describe('deleting', () => {
    it('keeps the logged sessions when their workout is deleted', async () => {
      await as(owner).delete(`/workout/${workoutId}`).expect(200);

      const { body } = await as(owner).get(`/session/${sessionId}`).expect(200);
      expect(body.workoutId).toBeNull();
      expect(body.exercises[0].workoutExerciseId).toBeNull();
      expect(body.exercises[0].sets).toHaveLength(2);
    });

    it('deletes a set, then the whole session', async () => {
      await as(owner).delete(`/session/set/${setId}`).expect(200);
      await as(owner).delete(`/session/${sessionId}`).expect(200);
      await as(owner).get(`/session/${sessionId}`).expect(404);
    });
  });
});
