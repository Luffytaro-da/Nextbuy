import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductById, fetchProducts, getErrorMessage } from '../services/api';
import type { BackendProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [related, setRelated] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const [prodRes, allRes] = await Promise.all([
          fetchProductById(id),
          fetchProducts(),
        ]);
        setProduct(prodRes.data);
        setRelated(allRes.data.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="nb-loader">
        <div className="spinner-border text-dark" style={{ width: '2.2rem', height: '2.2rem' }} role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <span className="nb-section-sub">Fetching product details…</span>
      </div>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="nb-empty container">
        <div className="nb-empty-icon">🔍</div>
        <h4 className="fw-bold mb-2">Product Not Found</h4>
        <p className="text-muted mb-4">{error || "The product you're looking for doesn't exist."}</p>
        <Link to="/" className="btn btn-dark nb-btn-dark px-4">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1100px' }}>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Products</Link>
          </li>
          {product.category && (
            <li className="breadcrumb-item">
              <Link to={`/category/${product.category.toLowerCase()}`} className="text-decoration-none">
                {product.category}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      {/* ── Main Section ── */}
      <div className="row g-5 align-items-start mb-5">

        {/* Image */}
        <div className="col-12 col-md-6">
          <div className="nb-detail-img">
            <img
              src={product.image || 'https://placehold.co/600x420?text=No+Image'}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x420?text=No+Image'; }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="col-12 col-md-6">
          <span className="nb-category-badge mb-2 d-inline-block">{product.category}</span>

          <h1 className="fw-bold mb-2" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em' }}>
            {product.name}
          </h1>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="nb-stars">★★★★☆</span>
            <span className="text-muted" style={{ fontSize: '0.82rem' }}>4.0 · 128 reviews</span>
          </div>

          <p className="nb-detail-price mb-1">₹{product.price.toLocaleString()}</p>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Inclusive of all taxes</p>

          <hr className="nb-divider" />

          <p className="text-muted mb-4" style={{ lineHeight: '1.75', fontSize: '0.95rem' }}>
            {product.description}
          </p>

          {/* Meta */}
          <div className="d-flex flex-column gap-2 mb-4" style={{ fontSize: '0.88rem' }}>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 90, color: '#6b7280', fontWeight: 500 }}>Availability</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                ✓ In Stock
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 90, color: '#6b7280', fontWeight: 500 }}>Shipping</span>
              <span className="text-muted">Free delivery on orders above ₹999</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 90, color: '#6b7280', fontWeight: 500 }}>Returns</span>
              <span className="text-muted">7-day easy return policy</span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-3 flex-wrap">
            <button
              className={`btn fw-semibold px-4 py-2 nb-btn-dark ${added ? 'btn-success' : 'btn-dark'}`}
              onClick={handleAddToCart}
              style={{ minWidth: '160px', borderRadius: '10px' }}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <Link
              to="/cart"
              className="btn btn-outline-dark fw-semibold px-4 py-2 nb-btn-outline"
              style={{ borderRadius: '10px' }}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div>
          <h5 className="fw-bold mb-3" style={{ letterSpacing: '-0.01em' }}>You Might Also Like</h5>
          <div className="row row-cols-2 row-cols-sm-4 g-3">
            {related.map((p) => (
              <div className="col" key={p._id}>
                <div className="nb-card h-100">
                  <Link to={`/product/${p._id}`} className="text-decoration-none">
                    <div className="nb-card-img" style={{ height: '150px' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x150?text=No+Image'; }}
                      />
                    </div>
                  </Link>
                  <div className="nb-card-body">
                    <span className="nb-category-badge">{p.category}</span>
                    <Link to={`/product/${p._id}`} className="text-decoration-none">
                      <p className="nb-card-title" style={{ fontSize: '0.85rem' }}>{p.name}</p>
                    </Link>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="nb-price" style={{ fontSize: '0.9rem' }}>₹{p.price.toLocaleString()}</span>
                      <Link to={`/product/${p._id}`} className="btn btn-sm btn-outline-secondary nb-btn-outline" style={{ fontSize: '0.75rem' }}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
