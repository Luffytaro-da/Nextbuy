import { useEffect, useState } from 'react';
import { fetchAllOrders, updateAdminOrderStatus } from '../../services/api';
import type { Order, OrderStatus } from '../../services/api';

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColour: Record<string, string> = {
  Pending:    'warning',
  Processing: 'info',
  Shipped:    'primary',
  Delivered:  'success',
  Cancelled:  'danger',
};

const AdminOrders = () => {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState<OrderStatus | 'All'>('All');

  // Track which order is currently being updated (shows spinner on its row)
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Fetch all orders on mount ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllOrders();
        setOrders(res.data);
      } catch {
        setError('Failed to load orders from the server.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Update status via API ──────────────────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await updateAdminOrderStatus(id, newStatus);
      // Update local state with the response from the server
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data : o)));
    } catch {
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark mb-3" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted">Loading orders…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h2 className="fw-bold mb-0">Manage Orders</h2>
        <span className="badge bg-dark px-3 py-2">{orders.length} Total</span>
      </div>
      <p className="text-muted mb-4">View and update customer order statuses in real-time</p>

      {/* Status Filter Tabs */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {(['All', ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            className={`btn btn-sm px-3 ${filter === s ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s}
            {s !== 'All' && (
              <span className="ms-1 badge bg-secondary">
                {orders.filter((o) => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 text-muted small fw-semibold">Order ID</th>
                  <th className="py-3 text-muted small fw-semibold">Customer ID</th>
                  <th className="py-3 text-muted small fw-semibold">Items</th>
                  <th className="py-3 text-muted small fw-semibold">Date</th>
                  <th className="py-3 text-muted small fw-semibold">Amount</th>
                  <th className="py-3 text-muted small fw-semibold">Status</th>
                  <th className="py-3 text-muted small fw-semibold pe-4">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id}>
                    {/* Order ID */}
                    <td className="px-4 text-muted small" style={{ fontFamily: 'monospace' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer (userId — shortened) */}
                    <td className="small text-muted" style={{ fontFamily: 'monospace' }}>
                      {order.userId.slice(-8).toUpperCase()}
                    </td>

                    {/* Items summary */}
                    <td className="small">
                      <div style={{ maxWidth: '200px' }}>
                        {order.items.length === 1 ? (
                          <span>{order.items[0].name} × {order.items[0].quantity}</span>
                        ) : (
                          <>
                            <span>{order.items[0].name}</span>
                            <span className="text-muted"> +{order.items.length - 1} more</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="text-muted small">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>

                    {/* Amount */}
                    <td className="fw-bold small">₹{order.totalAmount.toLocaleString()}</td>

                    {/* Status badge */}
                    <td>
                      <span className={`badge bg-${statusColour[order.status] ?? 'secondary'} px-3 py-2`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td className="pe-4">
                      {updatingId === order._id ? (
                        <span className="spinner-border spinner-border-sm text-secondary" role="status" />
                      ) : (
                        <select
                          className="form-select form-select-sm"
                          style={{ minWidth: '130px' }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          aria-label={`Update status for order ${order._id}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      {orders.length === 0
                        ? '📦 No orders have been placed yet.'
                        : 'No orders found for this status.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
