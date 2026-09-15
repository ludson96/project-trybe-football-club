import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { matchesController } from '../routers/matcheRouters';
import {
  allMatches,
  matcheInProgress,
  matcheNotInProgress,
  insertMatche,
  newMatche,
  token,
  insertTeamNonexistent,
  insertTeamRepetido,
} from './mocks/matche.mock';

describe('Teste Matche (Vitest)', () => {
  describe('GET /matches - Retorna partidas', () => {
    it('com sucesso (todas as partidas)', async () => {
      vi.spyOn(matchesController.matchesService, 'getMatches').mockResolvedValue(allMatches as any);

      const response = await request(app).get('/matches');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(allMatches);

      vi.restoreAllMocks();
    });

    it('retorna apenas partidas em progresso', async () => {
      vi.spyOn(matchesController.matchesService, 'getMatches').mockResolvedValue(matcheInProgress as any);

      const response = await request(app)
        .get('/matches')
        .query({ inProgress: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(matcheInProgress);

      vi.restoreAllMocks();
    });

    it('retorna apenas partidas finalizadas', async () => {
      vi.spyOn(matchesController.matchesService, 'getMatches').mockResolvedValue(matcheNotInProgress as any);

      const response = await request(app)
        .get('/matches')
        .query({ inProgress: 'false' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(matcheNotInProgress);

      vi.restoreAllMocks();
    });
  });

  describe('POST /matches - Criar uma partida', () => {
    it('com sucesso', async () => {
      vi.spyOn(matchesController.matchesService, 'createMatche').mockResolvedValue({
        status: 201,
        message: newMatche as any,
      });

      const response = await request(app)
        .post('/matches')
        .send(insertMatche)
        .set({ Authorization: token });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newMatche);

      vi.restoreAllMocks();
    });

    it('não é possível criar uma partida com time inexistente', async () => {
      vi.spyOn(matchesController.matchesService, 'createMatche').mockResolvedValue({
        status: 404,
        message: 'There is no team with such id!' as any,
      });

      const response = await request(app)
        .post('/matches')
        .send(insertTeamNonexistent)
        .set({ Authorization: token });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'There is no team with such id!' });

      vi.restoreAllMocks();
    });

    it('não é possível criar uma partida com dois times iguais', async () => {
      vi.spyOn(matchesController.matchesService, 'createMatche').mockResolvedValue({
        status: 422,
        message: 'It is not possible to create a match with two equal teams' as any,
      });

      const response = await request(app)
        .post('/matches')
        .send(insertTeamRepetido)
        .set({ Authorization: token });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({ message: 'It is not possible to create a match with two equal teams' });

      vi.restoreAllMocks();
    });
  });

  describe('PATCH /matches/:id/finish - Finaliza partida', () => {
    it('com sucesso', async () => {
      vi.spyOn(matchesController.matchesService, 'finish').mockResolvedValue(undefined);

      const response = await request(app)
        .patch('/matches/1/finish');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Finished' });

      vi.restoreAllMocks();
    });
  });

  describe('PATCH /matches/:id - Atualiza partida', () => {
    it('com sucesso', async () => {
      vi.spyOn(matchesController.matchesService, 'updateMatche').mockResolvedValue({} as any);

      const response = await request(app)
        .patch('/matches/1')
        .send({ homeTeamGoals: 3, awayTeamGoals: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Partida atualizada com sucesso!!' });

      vi.restoreAllMocks();
    });
  });
});
