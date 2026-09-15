import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { teamsController } from '../routers/teamsRoutes';
import { allTeams, teamId } from './mocks/teams.mock';

describe('Teste Teams (Vitest)', () => {
  describe('GET /teams - Retorna todos os times', () => {
    it('com sucesso', async () => {
      vi.spyOn(teamsController.teamsService, 'getAllTeams').mockResolvedValue(allTeams as any);

      const response = await request(app).get('/teams');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(allTeams);

      vi.restoreAllMocks();
    });

    it('internal Error (500)', async () => {
      vi.spyOn(teamsController.teamsService, 'getAllTeams').mockRejectedValue(new Error('db query failed'));

      const response = await request(app).get('/teams');

      expect(response.status).toBe(500);
      expect(response.body).toBe('db query failed');

      vi.restoreAllMocks();
    });
  });

  describe('GET /teams/:id - Retorna um time específico', () => {
    it('com sucesso', async () => {
      vi.spyOn(teamsController.teamsService, 'getTeamById').mockResolvedValue(teamId as any);

      const response = await request(app).get('/teams/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(teamId);

      vi.restoreAllMocks();
    });

    it('internal Error (500)', async () => {
      vi.spyOn(teamsController.teamsService, 'getTeamById').mockRejectedValue(new Error('db query failed'));

      const response = await request(app).get('/teams/1');

      expect(response.status).toBe(500);
      expect(response.body).toBe('db query failed');

      vi.restoreAllMocks();
    });
  });
});
