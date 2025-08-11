import { pool } from '../connection.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
           SELECT 
  n.id,
  n.message,
  n.created_at,
  n.is_read,
  n.interested_first_name,
  n.interested_last_name,
  n.interested_email,
  p.title as product_title,
  p.image_url as product_image
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

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    const product = productExists.rows[0];

    const userExists = await pool.query(
      'SELECT first_name, last_name, email FROM users WHERE id = $1',
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const user = userExists.rows[0];

    const result = await pool.query(`
      INSERT INTO notifications (user_id, product_id, message, interested_first_name, interested_last_name, interested_email)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [product.user_id, product_id, message, user.first_name, user.last_name, user.email]);

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

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación eliminada', data: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

