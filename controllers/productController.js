import { pool } from '../connection.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, user_id, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, u.first_name, u.last_name, u.email as seller_email,
             CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN favorites f ON p.id = f.product_id AND f.user_id = $1
      WHERE 1=1
    `;
    
    const params = [req.user?.id || null];
    let paramIndex = 2;

    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (user_id) {
      query += ` AND p.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(`
      SELECT p.*, u.first_name, u.last_name, u.email as seller_email, u.phone as seller_phone,
             CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN favorites f ON p.id = f.product_id AND f.user_id = $1
      WHERE p.id = $2
    `, [userId, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json({
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image_url, condition, location } = req.body;
    const userId = req.user.id;

    // Validar campos requeridos
    if (!title || !price) {
      return res.status(400).json({
        error: 'Título y precio son requeridos'
      });
    }

    const result = await pool.query(`
      INSERT INTO products (title, description, price, category, image_url, condition, location, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, description, price, category, image_url, condition || 'nuevo', location, userId]);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image_url, condition, location } = req.body;
    const userId = req.user.id;

    // Verificar que el producto pertenece al usuario
    const existingProduct = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado o no tienes permisos para editarlo'
      });
    }

    const result = await pool.query(`
      UPDATE products 
      SET title = $1, description = $2, price = $3, category = $4, 
          image_url = $5, condition = $6, location = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `, [title, description, price, category, image_url, condition, location, id, userId]);

    res.json({
      message: 'Producto actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado o no tienes permisos para eliminarlo'
      });
    }

    res.json({
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

