const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validatePost, validateNumericParam } = require('../middleware/validation');

// Rutas públicas (con autenticación opcional)
router.get('/', optionalAuth, PostController.getAll);
router.get('/:id', validateNumericParam('id'), optionalAuth, PostController.getById);
router.get('/user/:userId', validateNumericParam('userId'), optionalAuth, PostController.getByUserId);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, validatePost, PostController.create);
router.get('/my/posts', authenticateToken, PostController.getMyPosts);
router.put('/:id', authenticateToken, validateNumericParam('id'), PostController.update);
router.delete('/:id', authenticateToken, validateNumericParam('id'), PostController.delete);

module.exports = router;

