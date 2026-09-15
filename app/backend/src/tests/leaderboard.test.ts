import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { allHome, allLeaderBoard, allAway } from './mocks/leaderboard.mock';

describe('Testando endpoint /leaderboard (Vitest)', () => {
  it('filtra as classificações dos times da casa (/leaderboard/home)', async () => {
    const response = await request(app).get('/leaderboard/home');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(allHome);
  });

  it('filtra as classificações dos times de fora (/leaderboard/away)', async () => {
    const response = await request(app).get('/leaderboard/away');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(allAway);
  });

  it('filtra as classificações gerais dos times (/leaderboard)', async () => {
    const response = await request(app).get('/leaderboard');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(allLeaderBoard);
  });
});
