import { pool } from '../connection.js';

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT p.*, 
             COUNT(f.id) as favorite_count,
             COUNT(n.id) as notification_count
      FROM products p
      LEFT JOIN favorites f ON p.id = f.product_id
      LEFT JOIN notifications n ON p.id = n.product_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json({
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo posts del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener estadísticas del usuario
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE user_id = $1) as total_posts,
        (SELECT COUNT(*) FROM favorites f JOIN products p ON f.product_id = p.id WHERE p.user_id = $1) as total_favorites_received,
        (SELECT COUNT(*) FROM favorites WHERE user_id = $1) as total_favorites_given,
        (SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false) as unread_notifications
    `, [userId]);

    // Obtener productos recientes del usuario
    const recentPostsResult = await pool.query(`
      SELECT * FROM products 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);

    // Obtener notificaciones recientes
    const recentNotificationsResult = await pool.query(`
      SELECT n.*, p.title as product_title
      FROM notifications n
      LEFT JOIN products p ON n.product_id = p.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      data: {
        stats: statsResult.rows[0],
        recent_posts: recentPostsResult.rows,
        recent_notifications: recentNotificationsResult.rows
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};