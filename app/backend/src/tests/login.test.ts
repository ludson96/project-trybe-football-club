import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { userController } from '../routers/userRoutes';
import { token, validLogin, withoutEmail, withoutPwd, invalidEmail, invalidPwd } from './mocks/login.mock';

describe('Teste User (Vitest)', () => {
  describe('POST /login - Realizar login', () => {
    it('Realizar login com sucesso', async () => {
      vi.spyOn(userController.userService, 'login').mockResolvedValue(token as any);

      const response = await request(app)
        .post('/login')
        .send(validLogin);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');

      vi.restoreAllMocks();
    });

    it('Não é possível realizar login sem email', async () => {
      const response = await request(app)
        .post('/login')
        .send(withoutEmail);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'All fields must be filled' });
    });

    it('Não é possível realizar login sem senha', async () => {
      const response = await request(app)
        .post('/login')
        .send(withoutPwd);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'All fields must be filled' });
    });

    it('Não é possível realizar login com um email incorreto', async () => {
      vi.spyOn(userController.userService, 'login').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/login')
        .send(invalidEmail);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Incorrect email or password' });

      vi.restoreAllMocks();
    });

    it('Não é possível realizar login com a senha incorreto', async () => {
      vi.spyOn(userController.userService, 'login').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/login')
        .send(invalidPwd);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Incorrect email or password' });

      vi.restoreAllMocks();
    });
  });

  describe('GET /login/validate - Validar token', () => {
    it('Retorna a role corretamente com token válido', async () => {
      vi.spyOn(userController.userService, 'getRole').mockResolvedValue({ type: 'user' });

      const response = await request(app)
        .get('/login/validate')
        .set({ Authorization: token });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ role: 'user' });

      vi.restoreAllMocks();
    });

    it('Email inexistente / incorreto no token', async () => {
      vi.spyOn(userController.userService, 'getRole').mockResolvedValue({ type: undefined });

      const response = await request(app)
        .get('/login/validate')
        .set({ Authorization: token });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'email incorreto' });

      vi.restoreAllMocks();
    });

    it('Token inválido', async () => {
      const response = await request(app)
        .get('/login/validate')
        .set({ Authorization: 'invalid_token' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token must be a valid token' });
    });

    it('Token ausente / inexistente', async () => {
      const response = await request(app)
        .get('/login/validate');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token inexistente' });
    });
  });
});