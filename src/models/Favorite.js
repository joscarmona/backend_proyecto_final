const { pool } = require('../config/database');

class Favorite {
  // Agregar a favoritos
  static async create(userId, postId) {
    const query = `
      INSERT INTO favorites (user_id, post_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [userId, postId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener favoritos de un usuario
  static async findByUserId(userId) {
    const query = `
      SELECT f.*, p.title, p.description, p.price, p.picture, u.name as user_name
      FROM favorites f
      INNER JOIN posts p ON f.post_id = p.id
      INNER JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1
      ORDER BY f.id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Verificar si un post está en favoritos
  static async exists(userId, postId) {
    const query = 'SELECT id FROM favorites WHERE user_id = $1 AND post_id = $2';
    const result = await pool.query(query, [userId, postId]);
    return result.rows.length > 0;
  }

  // Eliminar de favoritos
  static async delete(userId, postId) {
    const query = 'DELETE FROM favorites WHERE user_id = $1 AND post_id = $2 RETURNING id';
    const result = await pool.query(query, [userId, postId]);
    return result.rows[0];
  }

  // Obtener todos los favoritos
  static async findAll() {
    const query = `
      SELECT f.*, p.title, p.description, p.price, u.name as user_name
      FROM favorites f
      INNER JOIN posts p ON f.post_id = p.id
      INNER JOIN users u ON f.user_id = u.id
      ORDER BY f.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Favorite;

