import mongoose, { Schema, Document } from 'mongoose';

// ─── Item embedded in an order ────────────────────────────────────────────────
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ─── Order document ───────────────────────────────────────────────────────────
export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true },
    image:     { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>({
  userId:         { type: String, required: true },
  items:          { type: [OrderItemSchema], required: true },
  totalAmount:    { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
