import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/productModel';

dotenv.config();

const products = [
  // ── Headphones ─────────────────────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5',
    price: 24999,
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Headphones',
  },
  {
    name: 'boAt Rockerz 550',
    price: 1799,
    description: 'On-ear Bluetooth headphones with 20-hour playback and 40mm dynamic drivers.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    category: 'Headphones',
  },
  {
    name: 'JBL Tune 760NC',
    price: 5999,
    description: 'Wireless over-ear headphones with active noise cancellation and fast charging.',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
    category: 'Headphones',
  },

  // ── Speakers ───────────────────────────────────────────────────────────────
  {
    name: 'JBL Charge 5',
    price: 12999,
    description: 'Portable Bluetooth speaker with 20-hour battery and IP67 waterproof rating.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    category: 'Speakers',
  },
  {
    name: 'boAt Stone 1200',
    price: 3499,
    description: '12W wireless speaker with thumping bass and 360° immersive sound.',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=300&fit=crop',
    category: 'Speakers',
  },
  {
    name: 'Sony SRS-XB33',
    price: 9999,
    description: 'Extra bass portable party speaker with multi-colour line lighting.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    category: 'Speakers',
  },

  // ── Gaming ─────────────────────────────────────────────────────────────────
  {
    name: 'Razer BlackShark V2 X',
    price: 5499,
    description: 'Gaming headset with 7.1 surround sound and cardioid microphone.',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop',
    category: 'Gaming',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 4299,
    description: 'RGB mechanical keyboard with tactile blue switches for competitive gaming.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    category: 'Gaming',
  },
  {
    name: 'Gaming Mouse Logitech G502',
    price: 3999,
    description: 'HERO 25K sensor mouse with 11 programmable buttons and adjustable weights.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    category: 'Gaming',
  },

  // ── Wearables ──────────────────────────────────────────────────────────────
  {
    name: 'Apple Watch SE (2nd Gen)',
    price: 29999,
    description: 'Smart watch with crash detection, heart rate monitor and sleep tracking.',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
    category: 'Wearables',
  },
  {
    name: 'Amazfit GTR 4',
    price: 9999,
    description: 'Smart watch with 150+ sports modes, GPS and 14-day battery.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Wearables',
  },
  {
    name: 'Noise ColorFit Pulse 2',
    price: 2499,
    description: 'Feature-rich smart watch with SpO2 monitor and 100+ cloud watch faces.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
    category: 'Wearables',
  },

  // ── Accessories ────────────────────────────────────────────────────────────
  {
    name: 'Anker 65W USB-C Charger',
    price: 1999,
    description: 'GaN fast charger with 65W output, powers laptop, phone and tablet together.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop',
    category: 'Accessories',
  },
  {
    name: 'Laptop Stand – Adjustable',
    price: 1499,
    description: 'Ergonomic aluminium stand with 6 height settings and foldable design.',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
    category: 'Accessories',
  },
  {
    name: 'Cable Management Kit',
    price: 599,
    description: 'Velcro ties, clips and sleeve for a clean, tangle-free desk setup.',
    image: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=300&fit=crop',
    category: 'Accessories',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nextbuy');
    console.log('MongoDB connected');

    await Product.deleteMany({});
    console.log('Old products cleared');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products across 5 categories`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
