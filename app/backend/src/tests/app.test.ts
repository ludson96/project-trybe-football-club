import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Rotas de Saúde e Middlewares (Vitest)', () => {
  it('GET / deve responder com { ok: true } (healthcheck)', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('deve possuir headers de CORS configurados adequadamente', async () => {
    const response = await request(app).get('/');

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });
});
