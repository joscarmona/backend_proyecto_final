import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword 
} from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', authenticateToken, getProfile);

// PUT /api/profile
router.put('/', authenticateToken, updateProfile);

// PUT /api/profile/password
router.put('/password', authenticateToken, changePassword);

export default router;

