import express from 'express';
import { 
  getUserPosts, 
  getUserDashboard 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/user/posts
router.get('/posts', authenticateToken, getUserPosts);

// GET /api/user/dashboard
router.get('/dashboard', authenticateToken, getUserDashboard);

export default router;

