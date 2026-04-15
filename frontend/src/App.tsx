import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';

// Pages
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main className="bg-light min-vh-100 py-3">
            <Routes>

              {/* ── Public Routes ───────────────────────────────────────────── */}
              <Route path="/" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ── Category Routes ─────────────────────────────────────────── */}
              {/* /category/headphones, /category/speakers, etc. */}
              <Route path="/category/:slug" element={<CategoryPage />} />

              {/* ── Protected Routes (login required) ─────────────────────── */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* ── Admin Routes (isAdmin=true required) ──────────────────── */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />

            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;