import express from 'express';
import { 
  getNotifications, 
  createNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticateToken, getNotifications);

// POST /api/notifications           // authenticate
router.post('/', createNotification);


// PUT /api/notifications/:notificationId/read
router.put('/:notificationId/read', authenticateToken, markNotificationAsRead);

// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', authenticateToken, markAllNotificationsAsRead);

router.delete('/:notificationId', authenticateToken, deleteNotification);


export default router;

