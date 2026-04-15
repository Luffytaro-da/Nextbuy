import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchAllOrders, getErrorMessage } from '../../services/api';
import type { BackendProduct, Order } from '../../services/api';

const AdminDashboard = () => {
  const [products, setProducts]           = useState<BackendProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError]   = useState('');

  const [orders, setOrders]               = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        setProductError(getErrorMessage(err));
      } finally {
        setLoadingProducts(false);
      }
    };

    const loadOrders = async () => {
      try {
        const res = await fetchAllOrders();
        setOrders(res.data);
      } catch {
        // Non-critical — stat card will just show 0
      } finally {
        setLoadingOrders(false);
      }
    };

    loadProducts();
    loadOrders();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = [...orders].slice(0, 5);


  // Stat card helper
  const stats = [
    {
      label: 'Total Products',
      icon: '📦',
      bg: '#eff6ff',
      color: '#2563eb',
      value: loadingProducts
        ? null
        : productError
        ? '—'
        : String(products.length),
      loading: loadingProducts,
    },
    {
      label: 'Total Orders',
      icon: '🛒',
      bg: '#f0fdf4',
      color: '#16a34a',
      value: String(orders.length),
      loading: loadingOrders,
    },
    {
      label: 'Total Users',
      icon: '👥',
      bg: '#fffbeb',
      color: '#d97706',
      value: '—',   // no users API yet
      loading: false,
    },
    {
      label: 'Revenue',
      icon: '💰',
      bg: '#fdf2f8',
      color: '#9333ea',
      value: loadingOrders ? null : `₹${totalRevenue.toLocaleString()}`,
      loading: loadingOrders,
    },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <h2 className="nb-section-title mb-0">Admin Dashboard</h2>
          <p className="nb-section-sub mb-0 mt-1">Overview of your store's performance</p>
        </div>
        <span
          className="badge px-3 py-2 fw-semibold"
          style={{ background: '#111827', borderRadius: '8px', fontSize: '0.8rem' }}
        >
          🛠️ Administrator
        </span>
      </div>

      <hr className="nb-divider mt-3 mb-4" />

      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        {stats.map(({ label, icon, bg, color, value, loading }) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="nb-stat-card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="nb-stat-icon"
                  style={{ background: bg, color, fontSize: '1.35rem' }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: '0.78rem', fontWeight: 500 }}>{label}</p>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-muted" role="status" />
                  ) : (
                    <h4 className="fw-bold mb-0" style={{ fontSize: '1.45rem', letterSpacing: '-0.02em' }}>
                      {value}
                    </h4>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Links ── */}
      <div className="row g-3 mb-4">
        {[
          {
            to: '/admin/products',
            icon: '🗂️',
            title: 'Manage Products',
            sub: 'Add, edit or remove products from the catalog',
          },
          {
            to: '/admin/orders',
            icon: '📋',
            title: 'Manage Orders',
            sub: 'View and update customer order statuses',
          },
        ].map(({ to, icon, title, sub }) => (
          <div className="col-12 col-sm-6" key={to}>
            <Link to={to} className="nb-quick-link">
              <div className="p-4 d-flex align-items-center gap-3">
                <span style={{ fontSize: '2rem' }}>{icon}</span>
                <div className="flex-grow-1">
                  <p className="fw-bold mb-0" style={{ fontSize: '0.95rem', color: '#111827' }}>{title}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{sub}</p>
                </div>
                <span className="text-muted fs-5">›</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ── Recent Orders ── */}
      <div className="card border-0" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-4"
          style={{ borderBottom: '1px solid #e5e7eb' }}>
          <h6 className="fw-bold mb-0">Recent Orders</h6>
          <Link to="/admin/orders" className="btn btn-sm btn-outline-dark nb-btn-outline" style={{ fontSize: '0.8rem' }}>
            View All →
          </Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="px-4">Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr><td colSpan={5} className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted">No orders yet.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4">
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {order.userId.slice(-8).toUpperCase()}
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {order.items[0]?.name ?? '—'}
                        {order.items.length > 1 && <span className="text-muted"> +{order.items.length - 1}</span>}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.88rem' }}>₹{order.totalAmount.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge bg-${{ Pending:'warning', Processing:'info', Shipped:'primary', Delivered:'success', Cancelled:'danger' }[order.status] ?? 'secondary'}`}
                          style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
