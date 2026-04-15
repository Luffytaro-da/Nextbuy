import mongoose, { Schema, Document } from 'mongoose';

// Valid category values — keep this list in sync with the frontend
export const CATEGORIES = [
  'Headphones',
  'Speakers',
  'Accessories',
  'Gaming',
  'Wearables',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: Category;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String },
  image:       { type: String },
  category:    { type: String, enum: CATEGORIES, default: 'Accessories' },
  createdAt:   { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
