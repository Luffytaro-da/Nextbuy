import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal       = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const total          = subtotal + deliveryCharge;
  const itemCount      = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Empty cart ─────────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="nb-empty">
          <div className="nb-empty-icon">🛒</div>
          <h3 className="fw-bold mb-2">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-dark nb-btn-dark px-5 py-2">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4" style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h2 className="nb-section-title mb-0">Your Cart</h2>
          <button
            className="btn btn-sm btn-outline-danger nb-btn-outline"
            onClick={clearCart}
            style={{ borderRadius: '8px', fontSize: '0.85rem' }}
          >
            🗑 Clear Cart
          </button>
        </div>
        <p className="nb-section-sub mb-4">{cartCount} item(s) in your cart</p>

        <div className="row g-4">

          {/* ── Cart Items ── */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div className="nb-cart-item" key={item._id}>
                  <div className="p-3">
                    <div className="row align-items-center g-3">

                      {/* Image */}
                      <div className="col-3 col-md-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{ width: '100%', height: '72px', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x72?text=Img'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="col-5 col-md-7">
                        <p className="fw-bold mb-1" style={{ fontSize: '0.92rem' }}>{item.name}</p>
                        <p className="text-muted mb-1" style={{ fontSize: '0.78rem' }}>{item.description}</p>
                        <span
                          className="d-inline-block text-muted"
                          style={{ fontSize: '0.78rem', background: '#f3f4f6', borderRadius: '6px', padding: '2px 10px' }}
                        >
                          Qty: {item.quantity}
                        </span>
                      </div>

                      {/* Price + Remove */}
                      <div className="col-4 col-md-3 text-end">
                        <p className="fw-bold mb-2" style={{ fontSize: '1rem' }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-muted mb-2" style={{ fontSize: '0.74rem' }}>
                          ₹{item.price.toLocaleString()} each
                        </p>
                        <button
                          className="btn btn-sm btn-outline-danger nb-btn-outline"
                          onClick={() => removeFromCart(item._id)}
                          style={{ fontSize: '0.78rem', borderRadius: '8px' }}
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <div className="mt-3">
              <Link to="/" className="text-decoration-none text-muted" style={{ fontSize: '0.88rem' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="col-12 col-lg-4">
            <div className="nb-summary-card p-4">
              <h5 className="fw-bold mb-3" style={{ letterSpacing: '-0.01em' }}>Order Summary</h5>
              <hr className="nb-divider" />

              {/* Line items */}
              <div className="d-flex flex-column gap-2 mb-3">
                {cartItems.map((item) => (
                  <div className="d-flex justify-content-between" key={item._id}>
                    <span className="text-muted" style={{ fontSize: '0.84rem' }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="nb-divider" />

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.85rem' }}>
                <span className="text-muted">Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.85rem' }}>
                <span className="text-muted">Delivery</span>
                <span className="text-success fw-semibold">
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                </span>
              </div>

              <hr className="nb-divider" />

              <div className="d-flex justify-content-between fw-bold mb-4" style={{ fontSize: '1.1rem' }}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {subtotal < 999 && (
                <div
                  className="mb-3 p-2 text-center"
                  style={{ background: '#fef3c7', fontSize: '0.8rem', color: '#92400e', border: '1px solid #fde68a', borderRadius: '8px' }}
                >
                  Add ₹{(999 - subtotal).toLocaleString()} more for free delivery!
                </div>
              )}

              <button
                className="btn btn-dark nb-btn-dark w-100 py-2 fw-semibold"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout payment modal */}
      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={total}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
      />
    </>
  );
};

export default Cart;
