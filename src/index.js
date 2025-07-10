const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const interestedRoutes = require('./routes/interestedRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: '*', // Permitir todos los orígenes para desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Marketplace API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/interested', interestedRoutes);

// Ruta para obtener información de la API
app.get('/api', (req, res) => {
  res.json({
    message: 'Marketplace API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrar nuevo usuario',
        'POST /api/auth/login': 'Iniciar sesión',
        'GET /api/auth/profile': 'Obtener perfil (requiere auth)',
        'PUT /api/auth/profile': 'Actualizar perfil (requiere auth)'
      },
      posts: {
        'GET /api/posts': 'Obtener todos los posts',
        'GET /api/posts/:id': 'Obtener post por ID',
        'POST /api/posts': 'Crear nuevo post (requiere auth)',
        'PUT /api/posts/:id': 'Actualizar post (requiere auth)',
        'DELETE /api/posts/:id': 'Eliminar post (requiere auth)',
        'GET /api/posts/my/posts': 'Obtener mis posts (requiere auth)',
        'GET /api/posts/user/:userId': 'Obtener posts de un usuario'
      },
      favorites: {
        'POST /api/favorites/:postId': 'Agregar a favoritos (requiere auth)',
        'GET /api/favorites': 'Obtener mis favoritos (requiere auth)',
        'DELETE /api/favorites/:postId': 'Eliminar de favoritos (requiere auth)',
        'GET /api/favorites/check/:postId': 'Verificar si está en favoritos (requiere auth)'
      },
      interested: {
        'POST /api/interested/post/:postId': 'Expresar interés (requiere auth)',
        'GET /api/interested/post/:postId': 'Obtener interesados en post (requiere auth)',
        'GET /api/interested/my': 'Obtener mis intereses (requiere auth)',
        'PUT /api/interested/:id': 'Actualizar interés (requiere auth)',
        'DELETE /api/interested/:id': 'Eliminar interés (requiere auth)'
      }
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    availableEndpoints: '/api'
  });
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ha ocurrido un error inesperado'
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
      console.log(`📍 URL local: http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API info: http://localhost:${PORT}/api`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor solo si este archivo es ejecutado directamente
if (require.main === module) {
  startServer();
}

module.exports = app;

