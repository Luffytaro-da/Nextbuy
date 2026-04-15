import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder, getErrorMessage } from '../services/api';
import type { OrderItem } from '../services/api';

// ─── Props ─────────────────────────────────────────────────────────────────────
interface CheckoutModalProps {
  show: boolean;
  onClose: () => void;
  total: number;
  deliveryCharge: number;
  subtotal: number;
}

// ─── Card-brand detection ──────────────────────────────────────────────────────
const getCardBrand = (num: string) => {
  const n = num.replace(/\s/g, '');
  if (n.startsWith('4'))              return 'VISA';
  if (/^5[1-5]/.test(n))             return 'MC';
  if (/^3[47]/.test(n))              return 'AMEX';
  return '';
};

// ─── Format card number with spaces every 4 digits ────────────────────────────
const fmtCard = (val: string) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// ─── Format expiry MM/YY ──────────────────────────────────────────────────────
const fmtExpiry = (val: string) => {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

type PayMethod = 'card' | 'upi' | 'netbanking';
type Step = 'form' | 'processing' | 'success';

const CheckoutModal = ({ show, onClose, total, deliveryCharge, subtotal }: CheckoutModalProps) => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // ── Payment method ──────────────────────────────────────────────────────────
  const [method, setMethod] = useState<PayMethod>('card');

  // ── Card fields ─────────────────────────────────────────────────────────────
  const [cardNum,  setCardNum]  = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvv,      setCvv]      = useState('');
  const [flipCard, setFlipCard] = useState(false);

  // ── UPI field ───────────────────────────────────────────────────────────────
  const [upiId, setUpiId] = useState('');

  // ── Net banking ─────────────────────────────────────────────────────────────
  const [bank, setBank] = useState('');

  // ── Error / step ────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [step,  setStep]  = useState<Step>('form');
  const [orderId, setOrderId] = useState('');

  // ─── Validate & submit ─────────────────────────────────────────────────────
  const handlePay = async () => {
    setError('');

    // Basic client-side validation
    if (method === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) return setError('Enter a valid 16-digit card number.');
      if (!cardName.trim())                        return setError('Enter the cardholder name.');
      if (expiry.length < 5)                       return setError('Enter a valid expiry date (MM/YY).');
      if (cvv.length < 3)                          return setError('Enter a valid CVV.');
    } else if (method === 'upi') {
      if (!upiId.includes('@'))                    return setError('Enter a valid UPI ID (e.g. name@upi).');
    } else {
      if (!bank)                                   return setError('Please select your bank.');
    }

    setStep('processing');

    // Simulate 2-second payment gateway delay
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item._id,
        name:      item.name,
        price:     item.price,
        quantity:  item.quantity,
        image:     item.image,
      }));
      const res = await placeOrder({ items: orderItems, totalAmount: total, deliveryCharge });
      setOrderId(res.data._id.slice(-6).toUpperCase());
      clearCart();
      setStep('success');
    } catch (err) {
      setStep('form');
      setError(getErrorMessage(err));
    }
  };

  const handleGoToOrders = () => {
    onClose();
    navigate('/orders');
  };

  if (!show) return null;

  const brand = getCardBrand(cardNum);
  const maskedNum = cardNum || '•••• •••• •••• ••••';
  const displayName = cardName || 'YOUR NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          zIndex: 1050, backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget && step !== 'processing') onClose(); }}
      >
        {/* ── Modal box ────────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '780px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            animation: 'slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* ── Processing overlay ─────────────────────────────────────────── */}
          {step === 'processing' && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)',
              zIndex: 10, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', borderRadius: '20px',
              gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                border: '5px solid #e5e7eb', borderTop: '5px solid #111',
                animation: 'spin 0.7s linear infinite',
              }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Processing Payment…</p>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>Please do not close this window</p>
            </div>
          )}

          {/* ── Success screen ─────────────────────────────────────────────── */}
          {step === 'success' && (
            <div style={{
              padding: '60px 40px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', marginBottom: '20px',
                animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
              }}>✓</div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Payment Successful!</h3>
              <p style={{ color: '#6b7280', marginBottom: '4px', fontSize: '0.95rem' }}>
                Your order has been placed successfully.
              </p>
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '12px', padding: '12px 24px', margin: '16px 0',
              }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#166534' }}>
                  Order #{orderId} &nbsp;·&nbsp; ₹{total.toLocaleString()} Paid
                </p>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '28px' }}>
                You'll receive updates on your order status.
              </p>
              <button
                className="btn btn-dark px-5 py-2 fw-semibold"
                style={{ borderRadius: '12px' }}
                onClick={handleGoToOrders}
              >
                View My Orders
              </button>
            </div>
          )}

          {/* ── Payment form ───────────────────────────────────────────────── */}
          {step === 'form' && (
            <div className="row g-0" style={{ position: 'relative' }}>

              {/* LEFT — order summary */}
              <div
                className="col-12 col-md-5 p-4"
                style={{ background: '#0f172a', borderRadius: '20px 0 0 20px', color: '#fff' }}
              >
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                    fontSize: '1rem',
                  }}
                >✕</button>

                <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>
                  ORDER SUMMARY
                </p>
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cartItems.map((item) => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '40px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x36?text=Img'; }}
                        />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', color: '#e2e8f0' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: '#1e293b', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: '#94a3b8', marginBottom: '12px' }}>
                  <span>Delivery</span>
                  <span style={{ color: '#4ade80' }}>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>

                {/* Security badges */}
                <div style={{ marginTop: '28px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['🔒 Secure', '✅ Encrypted', '🏦 Trusted'].map((b) => (
                    <span key={b} style={{
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', color: '#94a3b8',
                    }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT — payment form */}
              <div className="col-12 col-md-7 p-4" style={{ position: 'relative' }}>
                <h5 style={{ fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em' }}>
                  Complete Payment
                </h5>

                {/* Method tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
                  {([
                    { key: 'card', label: '💳 Card' },
                    { key: 'upi',  label: '📱 UPI'  },
                    { key: 'netbanking', label: '🏦 Net Banking' },
                  ] as { key: PayMethod; label: string }[]).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      style={{
                        flex: 1, border: 'none', borderRadius: '9px', padding: '8px 4px',
                        fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                        background: method === m.key ? '#fff' : 'transparent',
                        color: method === m.key ? '#111' : '#6b7280',
                        boxShadow: method === m.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                        transition: 'all 0.18s',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* ── CARD FORM ── */}
                {method === 'card' && (
                  <>
                    {/* Card preview */}
                    <div style={{
                      width: '100%', maxWidth: '320px', height: '176px', borderRadius: '16px', marginBottom: '20px',
                      background: 'linear-gradient(135deg,#1e293b 0%,#334155 100%)',
                      padding: '22px', color: '#fff', position: 'relative', overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      transform: flipCard ? 'rotateY(180deg)' : 'none',
                      transition: 'transform 0.5s',
                      transformStyle: 'preserve-3d',
                    }}>
                      {/* Glow circles */}
                      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.05em', fontWeight: 600 }}>NEXTBUY PAY</span>
                        {brand && <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', color: '#fbbf24' }}>{brand}</span>}
                      </div>
                      <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.2em', margin: '0 0 16px', color: '#e2e8f0' }}>
                        {maskedNum}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontSize: '0.62rem', color: '#64748b', margin: '0 0 2px', letterSpacing: '0.05em' }}>CARD HOLDER</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{displayName}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.62rem', color: '#64748b', margin: '0 0 2px', letterSpacing: '0.05em' }}>EXPIRES</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{displayExpiry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="mb-3">
                      <label style={labelStyle}>Card Number</label>
                      <input
                        type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                        value={cardNum}
                        onChange={(e) => setCardNum(fmtCard(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={labelStyle}>Cardholder Name</label>
                      <input
                        type="text" placeholder="Name as on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label style={labelStyle}>Expiry</label>
                        <input
                          type="text" placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-6">
                        <label style={labelStyle}>CVV</label>
                        <input
                          type="password" inputMode="numeric" placeholder="•••"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          onFocus={() => setFlipCard(true)}
                          onBlur={() => setFlipCard(false)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── UPI FORM ── */}
                {method === 'upi' && (
                  <div style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📱</div>
                      <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
                        Pay instantly using any UPI app
                      </p>
                    </div>
                    <div className="mb-4">
                      <label style={labelStyle}>UPI ID</label>
                      <input
                        type="text" placeholder="yourname@paytm / @gpay / @phonepe"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <button
                          key={app}
                          onClick={() => setUpiId(`myname@${app.toLowerCase()}`)}
                          style={{
                            border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px 16px',
                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: '#fff',
                            color: '#374151', transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── NET BANKING FORM ── */}
                {method === 'netbanking' && (
                  <div style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏦</div>
                      <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Choose your bank to proceed</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((b) => (
                        <button
                          key={b}
                          onClick={() => setBank(b)}
                          style={{
                            border: `2px solid ${bank === b ? '#111' : '#e5e7eb'}`,
                            borderRadius: '10px', padding: '12px',
                            fontWeight: 700, cursor: 'pointer',
                            background: bank === b ? '#111' : '#fff',
                            color: bank === b ? '#fff' : '#374151',
                            fontSize: '0.88rem', transition: 'all 0.15s',
                          }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    <div className="mb-3">
                      <label style={labelStyle}>Or select another bank</label>
                      <select
                        style={{ ...inputStyle, appearance: 'auto' }}
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                      >
                        <option value="">-- Select Bank --</option>
                        {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara', 'IndusInd', 'YES Bank'].map((b) => (
                          <option key={b} value={b}>{b} Bank</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px',
                    padding: '10px 14px', fontSize: '0.83rem', color: '#dc2626', marginBottom: '14px',
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
                    background: 'linear-gradient(135deg,#111 0%,#374151 100%)',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', letterSpacing: '-0.01em',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'opacity 0.15s',
                  }}
                >
                  🔒 Pay ₹{total.toLocaleString()} Now
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.74rem', color: '#9ca3af', marginTop: '12px', marginBottom: 0 }}>
                  By continuing you agree to our terms. Your payment is 100% secure.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframe styles ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
};

// ─── Shared input / label styles ──────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
  borderRadius: '10px', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.15s', background: '#fafafa',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '6px', fontSize: '0.78rem',
  fontWeight: 600, color: '#374151', letterSpacing: '0.02em',
};

export default CheckoutModal;
