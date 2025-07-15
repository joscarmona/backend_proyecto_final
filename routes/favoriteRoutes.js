import express from 'express';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  checkFavorite 
} from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/favorites
router.get('/', authenticateToken, getFavorites);

// POST /api/favorites
router.post('/', authenticateToken, addToFavorites);

// DELETE /api/favorites/:productId
router.delete('/:productId', authenticateToken, removeFromFavorites);

// GET /api/favorites/check/:productId
router.get('/check/:productId', authenticateToken, checkFavorite);

export default router;

