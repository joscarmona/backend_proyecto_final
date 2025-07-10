const { pool } = require('../config/database');

class Post {
  // Crear un nuevo post
  static async create(postData) {
    const { user_id, title, description, category, location, item_condition, price, picture } = postData;
    
    const query = `
      INSERT INTO posts (user_id, title, description, category, location, item_condition, price, picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [user_id, title, description, category, location, item_condition, price, picture];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todos los posts con información del usuario
  static async findAll() {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Buscar post por ID
  static async findById(id) {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Buscar posts por usuario
  static async findByUserId(userId) {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Buscar posts por categoría
  static async findByCategory(category) {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.category = $1
      ORDER BY p.id DESC
    `;
    const result = await pool.query(query, [category]);
    return result.rows;
  }

  // Actualizar post
  static async update(id, postData) {
    const { title, description, category, location, item_condition, price, picture } = postData;
    const query = `
      UPDATE posts 
      SET title = $1, description = $2, category = $3, location = $4, 
          item_condition = $5, price = $6, picture = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [title, description, category, location, item_condition, price, picture, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar post
  static async delete(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Buscar posts por término de búsqueda
  static async search(searchTerm) {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.title ILIKE $1 OR p.description ILIKE $1
      ORDER BY p.id DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = Post;

