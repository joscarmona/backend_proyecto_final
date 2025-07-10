const express = require('express');
const router = express.Router();
const InterestedController = require('../controllers/interestedController');
const { authenticateToken } = require('../middleware/auth');
const { validateInterested, validateNumericParam } = require('../middleware/validation');

// Todas las rutas de interesados requieren autenticación
router.post('/post/:postId', authenticateToken, validateNumericParam('postId'), validateInterested, InterestedController.create);
router.get('/post/:postId', authenticateToken, validateNumericParam('postId'), InterestedController.getByPost);
router.get('/my', authenticateToken, InterestedController.getMyInterests);
router.get('/all', authenticateToken, InterestedController.getAll);
router.get('/:id', authenticateToken, validateNumericParam('id'), InterestedController.getById);
router.put('/:id', authenticateToken, validateNumericParam('id'), validateInterested, InterestedController.update);
router.delete('/:id', authenticateToken, validateNumericParam('id'), InterestedController.delete);

module.exports = router;

