import { pool } from '../connection.js';

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT p.*, u.first_name, u.last_name, u.email as seller_email,
             f.created_at as favorited_at
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [userId]);

    res.json({
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.id;

    if (!product_id) {
      return res.status(400).json({
        error: 'ID del producto es requerido'
      });
    }

  
    const productExists = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [product_id]
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    
    const existingFavorite = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({
        error: 'El producto ya está en favoritos'
      });
    }

    
    const result = await pool.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [userId, product_id]
    );

    res.status(201).json({
      message: 'Producto agregado a favoritos',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error agregando a favoritos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Favorito no encontrado'
      });
    }

    res.json({
      message: 'Producto removido de favoritos'
    });

  } catch (error) {
    console.error('Error removiendo de favoritos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    res.json({
      data: {
        is_favorite: result.rows.length > 0
      }
    });

  } catch (error) {
    console.error('Error verificando favorito:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

