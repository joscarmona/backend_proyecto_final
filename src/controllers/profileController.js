import bcrypt from 'bcryptjs';
import { pool } from '../connection.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT id, email, first_name, last_name, phone, address, created_at
      FROM users 
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, address } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, email, first_name, last_name, phone, address, created_at, updated_at
    `, [first_name, last_name, phone, address, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        error: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const user = userResult.rows[0];

    
    const isValidPassword = await bcrypt.compare(current_password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Contraseña actual incorrecta'
      });
    }

   
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};