const request = require('supertest');
const app = require('../src/index');

describe('Posts Endpoints', () => {
  let authToken;
  let testPostId;
  let testUserId;

  // Setup: crear usuario y obtener token
  beforeAll(async () => {
    const userData = {
      name: 'Usuario Posts Test',
      email: 'posts-test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    testUserId = registerResponse.body.user.id;
  });

  // Test para crear post
  describe('POST /api/posts', () => {
    it('debería crear un nuevo post exitosamente', async () => {
      const postData = {
        title: 'Vestido elegante',
        description: 'Vestido negro elegante para ocasiones especiales, talla M',
        category: 'Mujer',
        location: 'Santiago',
        item_condition: 'Nuevo',
        price: 45000,
        picture: 'vestido-elegante.jpg'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('post');
      expect(response.body.post.title).toBe(postData.title);
      expect(response.body.post.price).toBe(postData.price);
      expect(response.body.post.user_id).toBe(testUserId);
      
      // Guardar ID del post para otras pruebas
      testPostId = response.body.post.id;
    });

    it('debería fallar al crear post sin autenticación', async () => {
      const postData = {
        title: 'Post sin auth',
        description: 'Este post no debería crearse',
        category: 'Mujer',
        location: 'Santiago',
        item_condition: 'Nuevo',
        price: 10000
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });

    it('debería fallar con datos inválidos', async () => {
      const postData = {
        title: 'AB', // Título muy corto
        description: 'Desc', // Descripción muy corta
        category: '', // Categoría vacía
        location: '',
        item_condition: '',
        price: -100 // Precio negativo
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });
  });

  // Test para obtener todos los posts
  describe('GET /api/posts', () => {
    it('debería obtener todos los posts exitosamente', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('debería filtrar posts por categoría', async () => {
      const response = await request(app)
        .get('/api/posts?category=Mujer')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
      
      // Verificar que todos los posts sean de la categoría solicitada
      response.body.posts.forEach(post => {
        expect(post.category).toBe('Mujer');
      });
    });

    it('debería buscar posts por término de búsqueda', async () => {
      const response = await request(app)
        .get('/api/posts?search=vestido')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });
  });

  // Test para obtener post por ID
  describe('GET /api/posts/:id', () => {
    it('debería obtener un post específico por ID', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPostId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('post');
      expect(response.body.post.id).toBe(testPostId);
      expect(response.body.post.title).toBe('Vestido elegante');
    });

    it('debería retornar 404 para post inexistente', async () => {
      const response = await request(app)
        .get('/api/posts/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Post no encontrado');
    });

    it('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/posts/abc')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Parámetro inválido');
    });
  });

  // Test para obtener posts del usuario autenticado
  describe('GET /api/posts/my/posts', () => {
    it('debería obtener los posts del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/posts/my/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      
      // Verificar que todos los posts pertenecen al usuario
      response.body.posts.forEach(post => {
        expect(post.user_id).toBe(testUserId);
      });
    });

    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/posts/my/posts')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });
});

