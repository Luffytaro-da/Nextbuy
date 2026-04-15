import axios from 'axios';

// ─── Base Axios Instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Valid Categories (keep in sync with backend) ─────────────────────────────
export const CATEGORIES = ['Headphones', 'Speakers', 'Accessories', 'Gaming', 'Wearables'] as const;
export type Category = (typeof CATEGORIES)[number];

// ─── Shared Product Type (matches MongoDB document) ───────────────────────────
export interface BackendProduct {
  _id: string;          // MongoDB ObjectId string — always present
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;   // NEW — one of the 5 valid categories
  createdAt?: string;
}

// ─── Auth APIs ─────────────────────────────────────────────────────────────────
export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post<{ token: string; user: { id: string; email: string; isAdmin: boolean } }>('/auth/login', data);

// PUT /me — update the logged-in user's profile (name, email, optional password)
export const updateProfile = (data: { name?: string; email?: string; password?: string }) =>
  api.put<{ id: string; name: string; email: string; isAdmin: boolean }>('/me', data);

// ─── Product APIs (Public) ────────────────────────────────────────────────────
// GET /products?category=Headphones  →  filtered list (omit param for all)
export const fetchProducts = (category?: string) =>
  api.get<BackendProduct[]>('/products', { params: category ? { category } : {} });

// GET /products/:id → returns one product
export const fetchProductById = (id: string) =>
  api.get<BackendProduct>(`/products/${id}`);

// ─── Product APIs (Admin Only) ────────────────────────────────────────────────
type ProductPayload = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

// POST /products → create a new product (admin JWT required)
export const createProduct = (data: ProductPayload) =>
  api.post<BackendProduct>('/products', data);

// PUT /products/:id → update a product (admin JWT required)
export const updateProduct = (id: string, data: ProductPayload) =>
  api.put<BackendProduct>(`/products/${id}`, data);

// DELETE /products/:id → delete a product (admin JWT required)
export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);

// ─── Order APIs ───────────────────────────────────────────────────────────────

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  status: OrderStatus;
  createdAt: string;
}

// POST /orders — place a new order (user must be logged in)
export const placeOrder = (data: {
  items: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
}) => api.post<Order>('/orders', data);

// GET /orders/my — fetch the logged-in user's order history
export const fetchMyOrders = () => api.get<Order[]>('/orders/my');

// GET /orders — fetch ALL orders (admin only)
export const fetchAllOrders = () => api.get<Order[]>('/orders');

// PUT /orders/:id/status — update an order's status (admin only)
export const updateAdminOrderStatus = (id: string, status: OrderStatus) =>
  api.put<Order>(`/orders/${id}/status`, { status });


// ─── Helper: Extract error message from Axios error ───────────────────────────
export const getErrorMessage = (err: unknown): string => {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { data?: { message?: string } } }).response?.data?.message
  ) {
    return (err as { response: { data: { message: string } } }).response.data.message;
  }
  return 'Something went wrong. Please try again.';
};

export default api;
