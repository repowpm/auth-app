import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { User } from '../models/User';

describe('Auth Endpoints', () => {
  let token: string;
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: '123456'
  };

  beforeAll(async () => {
    // Limpiar la base de datos antes de las pruebas
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await User.deleteMany({});
    // Cerrar la conexión a la base de datos
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('email', testUser.email);
    }, 10000);

    it('should not register a user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Error al registrar usuario');
    }, 10000);
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      token = res.body.token;
    }, 10000);

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
    }, 10000);
  });

  describe('GET /api/auth/me', () => {
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', testUser.name);
      expect(res.body).toHaveProperty('email', testUser.email);
    }, 10000);

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Por favor autentíquese');
    }, 10000);
  });
}); 