const request = require('supertest');
const app = require('../src/index');

describe('Auth Endpoints', () => {
  let authToken;
  let testUserId;

  // Test para registro de usuario
  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const userData = {
        name: 'Usuario Test',
        email: 'test@example.com',
        phone: '123456789',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      
      // Guardar token y ID para otras pruebas
      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    it('debería fallar al registrar usuario con email duplicado', async () => {
      const userData = {
        name: 'Usuario Test 2',
        email: 'test@example.com', // Email ya usado
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Usuario ya existe');
    });

    it('debería fallar con datos inválidos', async () => {
      const userData = {
        name: 'A', // Nombre muy corto
        email: 'email-invalido',
        password: '123' // Contraseña muy corta
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });
  });

  // Test para login
  describe('POST /api/auth/login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('debería fallar con credenciales inválidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password-incorrecta'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debería fallar con email inexistente', async () => {
      const loginData = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciales inválidas');
    });
  });

  // Test para obtener perfil
  describe('GET /api/auth/profile', () => {
    it('debería obtener el perfil con token válido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('debería fallar sin token de autorización', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });

    it('debería fallar con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer token-invalido')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token inválido');
    });
  });
});

