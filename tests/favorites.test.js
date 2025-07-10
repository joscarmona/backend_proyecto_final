const request = require('supertest');
const app = require('../src/index');

describe('Favorites Endpoints', () => {
  let authToken;
  let testPostId;
  let testUserId;

  // Setup: crear usuario, post y obtener token
  beforeAll(async () => {
    // Crear usuario
    const userData = {
      name: 'Usuario Favoritos Test',
      email: 'favorites-test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    testUserId = registerResponse.body.user.id;

    // Crear post para usar en favoritos
    const postData = {
      title: 'Post para favoritos',
      description: 'Este post será usado para probar favoritos',
      category: 'Mujer',
      location: 'Santiago',
      item_condition: 'Nuevo',
      price: 25000
    };

    const postResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(postData);

    testPostId = postResponse.body.post.id;
  });

  // Test para agregar a favoritos
  describe('POST /api/favorites/:postId', () => {
    it('debería agregar un post a favoritos exitosamente', async () => {
      const response = await request(app)
        .post(`/api/favorites/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('favorite');
      expect(response.body.favorite.user_id).toBe(testUserId);
      expect(response.body.favorite.post_id).toBe(testPostId);
    });

    it('debería fallar al agregar el mismo post dos veces', async () => {
      const response = await request(app)
        .post(`/api/favorites/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Ya está en favoritos');
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .post(`/api/favorites/${testPostId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });

    it('debería fallar con post inexistente', async () => {
      const response = await request(app)
        .post('/api/favorites/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Post no encontrado');
    });
  });

  // Test para obtener favoritos
  describe('GET /api/favorites', () => {
    it('debería obtener los favoritos del usuario', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('favorites');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.favorites)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Verificar que el post agregado está en favoritos
      const favorite = response.body.favorites.find(fav => fav.post_id === testPostId);
      expect(favorite).toBeDefined();
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });

  // Test para verificar si está en favoritos
  describe('GET /api/favorites/check/:postId', () => {
    it('debería verificar que el post está en favoritos', async () => {
      const response = await request(app)
        .get(`/api/favorites/check/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('isFavorite');
      expect(response.body.isFavorite).toBe(true);
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get(`/api/favorites/check/${testPostId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });

  // Test para eliminar de favoritos
  describe('DELETE /api/favorites/:postId', () => {
    it('debería eliminar un post de favoritos exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/favorites/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post eliminado de favoritos exitosamente');
    });

    it('debería fallar al eliminar post que no está en favoritos', async () => {
      const response = await request(app)
        .delete(`/api/favorites/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('No está en favoritos');
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .delete(`/api/favorites/${testPostId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });
});

