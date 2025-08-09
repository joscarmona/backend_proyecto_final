import { pool } from '../connection.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT n.*, p.title as product_title, p.image_url as product_image
      FROM notifications n
      LEFT JOIN products p ON n.product_id = p.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `, [userId]);

    res.json({
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { product_id, message } = req.body;
    const userId = req.user.id;

    if (!product_id || !message) {
      return res.status(400).json({
        error: 'ID del producto y mensaje son requeridos'
      });
    }

    
    const productExists = await pool.query(
      'SELECT id, user_id FROM products WHERE id = $1',
      [product_id]
    );

    /* ************************************************************** */
    // Se trabaja en mostrar el nombre y correo electrónico del usuario que muestra interés por determinado producto
    const userExists = await pool.query(
      'SELECT id, user_id FROM users WHERE id = $1',
      [userId]
    );
    /* ************************************************************** */

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    const product = productExists.rows[0];

    const result = await pool.query(`
      INSERT INTO notifications (user_id, product_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [product.user_id, product_id, message]);

    res.status(201).json({
      message: 'Notificación creada exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando notificación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE notifications 
      SET is_read = true 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [notificationId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Notificación no encontrada'
      });
    }

    res.json({
      message: 'Notificación marcada como leída',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `, [userId]);

    res.json({
      message: `${result.rows.length} notificaciones marcadas como leídas`,
      data: result.rows
    });

  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

