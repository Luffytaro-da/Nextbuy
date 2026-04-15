export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: number;
  product: string;
  date: string;
  amount: number;
  status: OrderStatus;
  customer: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  joined: string;
}

export const mockOrders: Order[] = [
  { id: 1, product: 'Wireless Headphones', date: '2024-04-01', amount: 2499, status: 'Delivered', customer: 'Ravi Kumar' },
  { id: 2, product: 'Smart Watch', date: '2024-04-03', amount: 3999, status: 'Shipped', customer: 'Priya Sharma' },
  { id: 3, product: 'Running Shoes', date: '2024-04-05', amount: 1799, status: 'Processing', customer: 'Amit Verma' },
  { id: 4, product: 'Mechanical Keyboard', date: '2024-04-06', amount: 4299, status: 'Pending', customer: 'Sneha Patel' },
  { id: 5, product: 'Backpack', date: '2024-04-07', amount: 1299, status: 'Cancelled', customer: 'Yash Singh' },
  { id: 6, product: 'Sunglasses', date: '2024-04-08', amount: 999, status: 'Delivered', customer: 'Neha Joshi' },
];

export const mockUsers: User[] = [
  { id: 1, name: 'Yash Singh', email: 'yash@example.com', role: 'Admin', joined: '2024-01-10' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'Customer', joined: '2024-02-15' },
  { id: 3, name: 'Amit Verma', email: 'amit@example.com', role: 'Customer', joined: '2024-03-01' },
  { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', role: 'Customer', joined: '2024-03-20' },
];

export const statusBadge: Record<OrderStatus, string> = {
  Pending: 'warning',
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};
