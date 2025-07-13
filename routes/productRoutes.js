import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products
router.get('/', optionalAuth, getProducts);

// GET /api/products/:id
router.get('/:id', optionalAuth, getProduct);

// POST /api/products
router.post('/', authenticateToken, createProduct);

// PUT /api/products/:id
router.put('/:id', authenticateToken, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authenticateToken, deleteProduct);

export default router;

