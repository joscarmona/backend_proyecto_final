const request = require('supertest');
const app = require('../src/index');

describe('Interested Endpoints', () => {
  let authToken1, authToken2;
  let testPostId;
  let testUserId1, testUserId2;
  let interestedId;

  // Setup: crear dos usuarios y un post
  beforeAll(async () => {
    // Crear primer usuario (dueño del post)
    const userData1 = {
      name: 'Usuario Dueño Post',
      email: 'owner-test@example.com',
      password: 'password123'
    };

    const registerResponse1 = await request(app)
      .post('/api/auth/register')
      .send(userData1);

    authToken1 = registerResponse1.body.token;
    testUserId1 = registerResponse1.body.user.id;

    // Crear segundo usuario (interesado)
    const userData2 = {
      name: 'Usuario Interesado',
      email: 'interested-test@example.com',
      password: 'password123'
    };

    const registerResponse2 = await request(app)
      .post('/api/auth/register')
      .send(userData2);

    authToken2 = registerResponse2.body.token;
    testUserId2 = registerResponse2.body.user.id;

    // Crear post con el primer usuario
    const postData = {
      title: 'Post para interesados',
      description: 'Este post será usado para probar interesados',
      category: 'Hombre',
      location: 'Valparaíso',
      item_condition: 'Usado',
      price: 35000
    };

    const postResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken1}`)
      .send(postData);

    testPostId = postResponse.body.post.id;
  });

  // Test para expresar interés
  describe('POST /api/interested/post/:postId', () => {
    it('debería expresar interés en un post exitosamente', async () => {
      const interestedData = {
        message: 'Estoy muy interesado en este artículo, ¿sigue disponible?'
      };

      const response = await request(app)
        .post(`/api/interested/post/${testPostId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send(interestedData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('interested');
      expect(response.body.interested.user_id).toBe(testUserId2);
      expect(response.body.interested.post_id).toBe(testPostId);
      expect(response.body.interested.message).toBe(interestedData.message);
      
      // Guardar ID para otras pruebas
      interestedId = response.body.interested.id;
    });

    it('debería fallar al expresar interés en propio post', async () => {
      const interestedData = {
        message: 'Interés en mi propio post'
      };

      const response = await request(app)
        .post(`/api/interested/post/${testPostId}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .send(interestedData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Acción no permitida');
    });

    it('debería fallar sin autenticación', async () => {
      const interestedData = {
        message: 'Mensaje sin autenticación'
      };

      const response = await request(app)
        .post(`/api/interested/post/${testPostId}`)
        .send(interestedData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });

    it('debería fallar con mensaje muy corto', async () => {
      const interestedData = {
        message: 'Hi' // Mensaje muy corto
      };

      const response = await request(app)
        .post(`/api/interested/post/${testPostId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send(interestedData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Mensaje inválido');
    });

    it('debería fallar con post inexistente', async () => {
      const interestedData = {
        message: 'Interés en post inexistente'
      };

      const response = await request(app)
        .post('/api/interested/post/99999')
        .set('Authorization', `Bearer ${authToken2}`)
        .send(interestedData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Post no encontrado');
    });
  });

  // Test para obtener interesados en un post
  describe('GET /api/interested/post/:postId', () => {
    it('debería obtener interesados en el post (como dueño)', async () => {
      const response = await request(app)
        .get(`/api/interested/post/${testPostId}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('interested');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.interested)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Verificar que el interés creado está en la lista
      const interest = response.body.interested.find(int => int.id === interestedId);
      expect(interest).toBeDefined();
      expect(interest.user_id).toBe(testUserId2);
    });

    it('debería fallar si no es el dueño del post', async () => {
      const response = await request(app)
        .get(`/api/interested/post/${testPostId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Acceso denegado');
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get(`/api/interested/post/${testPostId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });

  // Test para obtener mis intereses
  describe('GET /api/interested/my', () => {
    it('debería obtener los intereses del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/interested/my')
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('interests');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.interests)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Verificar que el interés creado está en la lista
      const interest = response.body.interests.find(int => int.id === interestedId);
      expect(interest).toBeDefined();
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/interested/my')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });

  // Test para actualizar interés
  describe('PUT /api/interested/:id', () => {
    it('debería actualizar el mensaje de interés exitosamente', async () => {
      const updateData = {
        message: 'Mensaje actualizado: ¿Podríamos coordinar una reunión?'
      };

      const response = await request(app)
        .put(`/api/interested/${interestedId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('interested');
      expect(response.body.interested.message).toBe(updateData.message);
    });

    it('debería fallar si no es el dueño del interés', async () => {
      const updateData = {
        message: 'Intento de actualización no autorizada'
      };

      const response = await request(app)
        .put(`/api/interested/${interestedId}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Acceso denegado');
    });

    it('debería fallar sin autenticación', async () => {
      const updateData = {
        message: 'Mensaje sin autenticación'
      };

      const response = await request(app)
        .put(`/api/interested/${interestedId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });
});

