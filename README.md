<<<<<<< HEAD
# Marketplace Backend API

Backend API REST para un marketplace de ropa desarrollado con Node.js, Express.js y PostgreSQL.

## Características

- ✅ API REST completa con CRUD para usuarios, posts, favoritos e interesados
- ✅ Autenticación y autorización con JWT
- ✅ Validación de datos con middlewares personalizados
- ✅ Conexión a base de datos PostgreSQL con pg
- ✅ Soporte CORS para consultas de orígenes cruzados
- ✅ Pruebas automatizadas con Jest y Supertest
- ✅ Estructura modular y organizada
- ✅ Manejo de errores centralizado
- ✅ Documentación de endpoints

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **CORS** - Soporte para orígenes cruzados
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs
- **dotenv** - Variables de entorno

## Estructura del Proyecto

```
marketplace-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── postController.js    # Controlador de posts
│   │   ├── favoriteController.js # Controlador de favoritos
│   │   └── interestedController.js # Controlador de interesados
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación JWT
│   │   └── validation.js        # Middleware de validación
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Post.js              # Modelo de post
│   │   ├── Favorite.js          # Modelo de favoritos
│   │   └── Interested.js        # Modelo de interesados
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── postRoutes.js        # Rutas de posts
│   │   ├── favoriteRoutes.js    # Rutas de favoritos
│   │   └── interestedRoutes.js  # Rutas de interesados
│   └── index.js                 # Archivo principal del servidor
├── tests/
│   ├── auth.test.js             # Pruebas de autenticación
│   ├── posts.test.js            # Pruebas de posts
│   ├── favorites.test.js        # Pruebas de favoritos
│   └── interested.test.js       # Pruebas de interesados
├── database/
│   └── marketplace_postgresql.sql # Script de base de datos
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
└── README.md                    # Documentación
```

## Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o extraer el proyecto**
   ```bash
   cd marketplace-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar base de datos PostgreSQL**
   - Crear una base de datos llamada `marketplace`
   - Ejecutar el script SQL incluido en `database/marketplace_postgresql.sql`

4. **Configurar variables de entorno**
   - Copiar `.env` y ajustar las credenciales de la base de datos:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=marketplace
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   JWT_SECRET=tu_clave_secreta_jwt
   NODE_ENV=development
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

6. **Ejecutar pruebas**
   ```bash
   npm test
   ```

## Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |
| GET | `/profile` | Obtener perfil del usuario | Sí |
| PUT | `/profile` | Actualizar perfil | Sí |

### Posts (`/api/posts`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/` | Obtener todos los posts | No |
| GET | `/:id` | Obtener post por ID | No |
| POST | `/` | Crear nuevo post | Sí |
| PUT | `/:id` | Actualizar post | Sí |
| DELETE | `/:id` | Eliminar post | Sí |
| GET | `/my/posts` | Obtener mis posts | Sí |
| GET | `/user/:userId` | Obtener posts de un usuario | No |

### Favoritos (`/api/favorites`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/:postId` | Agregar a favoritos | Sí |
| GET | `/` | Obtener mis favoritos | Sí |
| DELETE | `/:postId` | Eliminar de favoritos | Sí |
| GET | `/check/:postId` | Verificar si está en favoritos | Sí |

### Interesados (`/api/interested`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/post/:postId` | Expresar interés en un post | Sí |
| GET | `/post/:postId` | Obtener interesados en un post | Sí |
| GET | `/my` | Obtener mis intereses | Sí |
| PUT | `/:id` | Actualizar mensaje de interés | Sí |
| DELETE | `/:id` | Eliminar interés | Sí |

## Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos:

1. Registrarse o iniciar sesión para obtener un token
2. Incluir el token en el header `Authorization`:
   ```
   Authorization: Bearer tu_token_jwt
   ```

## Ejemplos de Uso

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "123456789",
    "password": "password123"
  }'
```

### Crear Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token" \
  -d '{
    "title": "Vestido elegante",
    "description": "Vestido negro para ocasiones especiales",
    "category": "Mujer",
    "location": "Santiago",
    "item_condition": "Nuevo",
    "price": 45000
  }'
```

## Pruebas

El proyecto incluye pruebas automatizadas para todos los endpoints principales:

- **Autenticación**: Registro, login, perfil
- **Posts**: CRUD completo, búsqueda, filtros
- **Favoritos**: Agregar, eliminar, listar
- **Interesados**: Expresar interés, gestionar mensajes

Ejecutar pruebas:
```bash
npm test
```

## Códigos de Estado HTTP

- `200` - OK
- `201` - Creado exitosamente
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `409` - Conflicto (ej: email duplicado)
- `500` - Error interno del servidor

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor crear un issue en el repositorio del proyecto.

=======
Proyecto Final

Hito 3 - Desarrollo Backend

Integrantes:
Joelis Jiménez,
Elier Jaque,
José Carmona
>>>>>>> f944dd30ca64c3fb14a20b8466239266f8625f86
