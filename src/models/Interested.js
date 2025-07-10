const { pool } = require('../config/database');

class Interested {
  // Crear un nuevo interés
  static async create(interestedData) {
    const { user_id, post_id, message } = interestedData;
    
    const query = `
      INSERT INTO interested (user_id, post_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [user_id, post_id, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener interesados por post
  static async findByPostId(postId) {
    const query = `
      SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM interested i
      INNER JOIN users u ON i.user_id = u.id
      WHERE i.post_id = $1
      ORDER BY i.id DESC
    `;
    const result = await pool.query(query, [postId]);
    return result.rows;
  }

  // Obtener intereses de un usuario
  static async findByUserId(userId) {
    const query = `
      SELECT i.*, p.title, p.description, p.price, p.picture, u.name as post_owner_name
      FROM interested i
      INNER JOIN posts p ON i.post_id = p.id
      INNER JOIN users u ON p.user_id = u.id
      WHERE i.user_id = $1
      ORDER BY i.id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Obtener todos los intereses
  static async findAll() {
    const query = `
      SELECT i.*, p.title, p.description, u.name as user_name, owner.name as post_owner_name
      FROM interested i
      INNER JOIN posts p ON i.post_id = p.id
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN users owner ON p.user_id = owner.id
      ORDER BY i.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const query = `
      SELECT i.*, p.title, p.description, u.name as user_name, owner.name as post_owner_name
      FROM interested i
      INNER JOIN posts p ON i.post_id = p.id
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN users owner ON p.user_id = owner.id
      WHERE i.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Actualizar mensaje de interés
  static async update(id, message) {
    const query = `
      UPDATE interested 
      SET message = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const values = [message, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar interés
  static async delete(id) {
    const query = 'DELETE FROM interested WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Interested;

