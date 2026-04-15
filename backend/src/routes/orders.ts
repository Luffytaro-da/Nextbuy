import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = Router();

// User routes (JWT required)
router.post('/',    auth, createOrder);       // POST   /api/orders       — place order
router.get('/my',   auth, getMyOrders);       // GET    /api/orders/my    — get my orders

// Admin routes (JWT + isAdmin required)
router.get('/',           auth, admin, getAllOrders);               // GET all orders
router.put('/:id/status', auth, admin, updateOrderStatus);         // update status

export default router;
