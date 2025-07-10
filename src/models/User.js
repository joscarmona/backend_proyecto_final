const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Crear un nuevo usuario
  static async create(userData) {
    const { name, email, phone, password, picture } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, phone, password, picture)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, picture
    `;
    
    const values = [name, email, phone, hashedPassword, picture];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = 'SELECT id, name, email, phone, picture FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener todos los usuarios
  static async findAll() {
    const query = 'SELECT id, name, email, phone, picture FROM users ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  // Actualizar usuario
  static async update(id, userData) {
    const { name, email, phone, picture } = userData;
    const query = `
      UPDATE users 
      SET name = $1, email = $2, phone = $3, picture = $4
      WHERE id = $5
      RETURNING id, name, email, phone, picture
    `;
    
    const values = [name, email, phone, picture, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar usuario
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

