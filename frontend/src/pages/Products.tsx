import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, getErrorMessage, CATEGORIES } from '../services/api';
import type { BackendProduct, Category } from '../services/api';
import { useCart } from '../context/CartContext';
import HeroSection from '../components/HeroSection';

const Products = () => {
  const { addToCart } = useCart();

  const [products, setProducts]           = useState<BackendProduct[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [addedId, setAddedId]             = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const category = activeCategory === 'All' ? undefined : activeCategory;
        const res = await fetchProducts(category);
        setProducts(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  const handleAdd = (product: BackendProduct) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      {/* Hero — only shown on "All" tab */}
      {activeCategory === 'All' && <HeroSection />}

      <div className="container py-4">

        {/* Section header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
          <div>
            <h2 className="nb-section-title mb-0">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h2>
            {!loading && (
              <p className="nb-section-sub mb-0 mt-1">{products.length} item(s) available</p>
            )}
          </div>
        </div>

        {/* Category filter chips */}
        <div className="mb-4 d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm nb-chip ${activeCategory === 'All' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm nb-chip ${activeCategory === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="nb-loader">
            <div className="spinner-border text-dark" role="status" style={{ width: '2.2rem', height: '2.2rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="nb-section-sub">Fetching products…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger d-flex gap-3 align-items-start" role="alert">
            <span className="fs-5">⚠️</span>
            <div>
              <strong>Failed to load products</strong>
              <p className="mb-1 mt-1 small">{error}</p>
              <p className="mb-2 small text-muted">Make sure the backend is running on http://localhost:3000</p>
              <button className="btn btn-sm btn-outline-danger" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="nb-empty">
            <div className="nb-empty-icon">📦</div>
            <h5 className="fw-bold mb-2">No products found</h5>
            <p className="text-muted mb-3">
              {activeCategory === 'All'
                ? 'No products have been added yet.'
                : `No products in "${activeCategory}" yet.`}
            </p>
            {activeCategory !== 'All' && (
              <button className="btn btn-dark nb-btn-dark px-4" onClick={() => setActiveCategory('All')}>
                View All Products
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
            {products.map((product) => (
              <div className="col" key={product._id}>
                <div className="nb-card h-100 d-flex flex-column">

                  {/* Image */}
                  <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <div className="nb-card-img">
                      <img
                        src={product.image || 'https://placehold.co/400x220?text=No+Image'}
                        alt={product.name}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x220?text=No+Image'; }}
                      />
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="nb-card-body d-flex flex-column flex-grow-1">
                    <span className="nb-category-badge">{product.category}</span>

                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                      <p className="nb-card-title">{product.name}</p>
                    </Link>

                    <p className="nb-card-desc flex-grow-1 mb-2">{product.description}</p>

                    <div className="nb-stars mb-2">★★★★☆ <span className="text-muted" style={{ fontSize: '0.72rem' }}>(128)</span></div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
                      <span className="nb-price">₹{product.price.toLocaleString()}</span>
                      <div className="d-flex gap-1">
                        <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-secondary nb-btn-outline" style={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                          Details
                        </Link>
                        <button
                          className={`btn btn-sm nb-btn-dark ${addedId === product._id ? 'btn-success' : 'btn-dark'}`}
                          onClick={() => handleAdd(product)}
                          style={{ fontSize: '0.8rem', minWidth: '52px' }}
                        >
                          {addedId === product._id ? '✓' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
