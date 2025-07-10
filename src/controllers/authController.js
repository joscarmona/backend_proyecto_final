const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

class AuthController {
  // Registro de usuario
  static async register(req, res) {
    try {
      const { name, email, phone, password, picture } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario registrado con este email'
        });
      }

      // Crear nuevo usuario
      const newUser = await User.create({
        name,
        email,
        phone: phone || null,
        password,
        picture: picture || null
      });

      // Generar token
      const token = generateToken(newUser.id);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: newUser,
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al registrar el usuario'
      });
    }
  }

  // Login de usuario
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Generar token
      const token = generateToken(user.id);

      // Remover contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login exitoso',
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al iniciar sesión'
      });
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req, res) {
    try {
      // El usuario ya está disponible en req.user gracias al middleware de autenticación
      res.json({
        message: 'Perfil obtenido exitosamente',
        user: req.user
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener el perfil'
      });
    }
  }

  // Actualizar perfil del usuario autenticado
  static async updateProfile(req, res) {
    try {
      const { name, email, phone, picture } = req.body;
      const userId = req.user.id;

      // Verificar si el nuevo email ya está en uso por otro usuario
      if (email && email !== req.user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            error: 'Email ya en uso',
            message: 'Este email ya está registrado por otro usuario'
          });
        }
      }

      // Actualizar usuario
      const updatedUser = await User.update(userId, {
        name: name || req.user.name,
        email: email || req.user.email,
        phone: phone || req.user.phone,
        picture: picture || req.user.picture
      });

      if (!updatedUser) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se pudo actualizar el perfil'
        });
      }

      res.json({
        message: 'Perfil actualizado exitosamente',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al actualizar el perfil'
      });
    }
  }
}

module.exports = AuthController;

