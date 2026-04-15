import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = Router();

router.post('/', auth, admin, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

export default router;
