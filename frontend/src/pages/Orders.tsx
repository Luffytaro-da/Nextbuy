import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../services/api';
import type { Order } from '../services/api';

// ── Status badge colour map ────────────────────────────────────────────────────
const statusColour: Record<string, string> = {
  Pending:    'warning',
  Processing: 'info',
  Shipped:    'primary',
  Delivered:  'success',
  Cancelled:  'danger',
};

const Orders = () => {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Expanded order IDs (for "View Details" accordion) ─────────────────────────
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMyOrders();
        setOrders(res.data);
      } catch {
        setError('Could not load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark mb-3" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted">Fetching your orders…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">⚠️ {error}</div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '3rem' }}>📦</div>
        <h5 className="fw-bold mb-2 mt-3">No orders yet</h5>
        <p className="text-muted mb-4">You haven't placed any orders yet.</p>
        <Link to="/" className="btn btn-dark px-4">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h2 className="fw-bold mb-0">My Orders</h2>
        <span className="badge bg-secondary px-3 py-2">{orders.length} Orders</span>
      </div>
      <p className="text-muted mb-4">Your real order history from the database</p>

      <div className="d-flex flex-column gap-3">
        {orders.map((order, idx) => {
          const isExpanded = expandedId === order._id;
          const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
          });
          // Short order reference shown to the user
          const shortId = order._id.slice(-6).toUpperCase();

          return (
            <div className="card border-0 shadow-sm" key={order._id}>
              <div className="card-body p-0">

                {/* ── Order header row ─────────────────────────────────────── */}
                <div className="px-4 py-3">
                  <div className="row align-items-center g-3">

                    {/* Order # + item summary */}
                    <div className="col-12 col-md-4">
                      <p className="text-muted small mb-1">Order #{shortId} &nbsp;·&nbsp; {idx + 1} of {orders.length}</p>
                      <h6 className="fw-semibold mb-0">
                        {order.items.length === 1
                          ? order.items[0].name
                          : `${order.items[0].name} + ${order.items.length - 1} more`}
                      </h6>
                    </div>

                    {/* Date */}
                    <div className="col-6 col-md-2">
                      <p className="text-muted small mb-0">Date</p>
                      <p className="fw-semibold mb-0 small">{date}</p>
                    </div>

                    {/* Total */}
                    <div className="col-6 col-md-2">
                      <p className="text-muted small mb-0">Total</p>
                      <p className="fw-bold mb-0">₹{order.totalAmount.toLocaleString()}</p>
                    </div>

                    {/* Status badge */}
                    <div className="col-6 col-md-2">
                      <p className="text-muted small mb-1">Status</p>
                      <span className={`badge bg-${statusColour[order.status] ?? 'secondary'} text-capitalize px-3 py-2`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Toggle details */}
                    <div className="col-6 col-md-2 text-md-end">
                      <button
                        className="btn btn-outline-dark btn-sm px-3"
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* ── Expanded item details ─────────────────────────────────── */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-top">
                    <p className="text-muted small fw-semibold mb-2 mt-3">ITEMS IN THIS ORDER</p>
                    <div className="d-flex flex-column gap-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-center gap-3 p-2 rounded"
                          style={{ background: '#f8f9fa' }}
                        >
                          {/* Thumbnail */}
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '52px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/52x48?text=Img'; }}
                          />
                          {/* Name + qty */}
                          <div className="flex-grow-1">
                            <p className="fw-semibold mb-0" style={{ fontSize: '0.88rem' }}>{item.name}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                              Qty: {item.quantity} &nbsp;·&nbsp; ₹{item.price.toLocaleString()} each
                            </p>
                          </div>
                          {/* Line total */}
                          <span className="fw-bold" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="mt-3 d-flex flex-column gap-1" style={{ maxWidth: '280px', marginLeft: 'auto' }}>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Subtotal</span>
                        <span>₹{(order.totalAmount - order.deliveryCharge).toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Delivery</span>
                        <span className="text-success">
                          {order.deliveryCharge === 0 ? 'Free' : `₹${order.deliveryCharge}`}
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total Paid</span>
                        <span>₹{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
