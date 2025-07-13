import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../connection.js';

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, address } = req.body;

    // Validar
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

   
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'El usuario ya existe'
      });
    }

 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, first_name, last_name, phone, address, created_at`,
      [email, hashedPassword, first_name, last_name, phone, address]
    );

    const user = result.rows[0];

    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar 
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

 
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

  
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, address, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
