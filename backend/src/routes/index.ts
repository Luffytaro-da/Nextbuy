import { Router } from 'express';
import { health } from '../controllers/healthController';
import authRouter from './auth';
import auth from '../middleware/auth';
import { me, updateMe } from '../controllers/userController';
import productsRouter from './products';
import ordersRouter from './orders';

const router = Router();

router.get('/health', health);
router.use('/auth', authRouter);

// User profile routes (JWT required)
router.get('/me', auth, me);
router.put('/me', auth, updateMe);

// Products
router.use('/products', productsRouter);

// Orders
router.use('/orders', ordersRouter);

export default router;
