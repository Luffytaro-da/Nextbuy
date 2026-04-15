import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ─── Product type uses MongoDB _id as a string ────────────────────────────────
export type Product = {
  _id: string;        // MongoDB ObjectId string (e.g. "663abc123...")
  name: string;
  price: number;
  image: string;
  description: string;
};

export type CartItem = Product & {
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (_id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Helper: Load cart from localStorage ─────────────────────────────────────
const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
};

// ─── Helper: Save cart to localStorage ───────────────────────────────────────
const saveCart = (items: CartItem[]): void => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage so cart survives page refresh
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  // Whenever cartItems change, save to localStorage automatically
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // Product already in cart — just increase quantity
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New product — add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (_id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== _id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Total item count (sum of all quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
