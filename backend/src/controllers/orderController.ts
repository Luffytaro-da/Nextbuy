import { Request, Response } from 'express';
import Order from '../models/orderModel';

// ─── POST /api/orders ──────────────────────────────────────────────────────────
// Create a new order from the user's cart items.
// Expects body: { items: [{ productId, name, price, quantity, image }], totalAmount, deliveryCharge }
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { items, totalAmount, deliveryCharge } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (totalAmount == null) {
      return res.status(400).json({ message: 'Missing totalAmount' });
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      deliveryCharge: deliveryCharge ?? 0,
      status: 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET /api/orders/my ────────────────────────────────────────────────────────
// Return all orders belonging to the currently logged-in user, newest first.
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET /api/orders  (admin) ─────────────────────────────────────────────────
// Return ALL orders in the database (admin use).
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUT /api/orders/:id/status  (admin) ──────────────────────────────────────
// Update the status field of a specific order.
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
