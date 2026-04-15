import type { Product } from '../context/CartContext';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'Premium sound quality with noise cancellation.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Track fitness, notifications and more.',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    description: 'Lightweight and comfortable for daily runs.',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: 'Tactile switches for the best typing experience.',
  },
  {
    id: 5,
    name: 'Backpack',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    description: 'Durable backpack with laptop compartment.',
  },
  {
    id: 6,
    name: 'Sunglasses',
    price: 999,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    description: 'UV400 protection with stylish frame.',
  },
];
