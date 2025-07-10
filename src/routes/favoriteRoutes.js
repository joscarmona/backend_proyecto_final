const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favoriteController');
const { authenticateToken } = require('../middleware/auth');
const { validateNumericParam } = require('../middleware/validation');

// Todas las rutas de favoritos requieren autenticación
router.post('/:postId', authenticateToken, validateNumericParam('postId'), FavoriteController.add);
router.get('/', authenticateToken, FavoriteController.getMyFavorites);
router.get('/all', authenticateToken, FavoriteController.getAll);
router.delete('/:postId', authenticateToken, validateNumericParam('postId'), FavoriteController.remove);
router.get('/check/:postId', authenticateToken, validateNumericParam('postId'), FavoriteController.checkFavorite);

module.exports = router;

