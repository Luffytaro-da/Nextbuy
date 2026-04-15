import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts, getErrorMessage, CATEGORIES } from '../services/api';
import type { BackendProduct, Category } from '../services/api';
import { useCart } from '../context/CartContext';

// Map URL slug → display label  e.g. "headphones" → "Headphones"
const slugToCategory = (slug: string): Category | null => {
  const match = CATEGORIES.find(
    (cat) => cat.toLowerCase() === slug.toLowerCase()
  );
  return match ?? null;
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [addedId, setAddedId]   = useState<string | null>(null);

  const category = slugToCategory(slug ?? '');

  useEffect(() => {
    if (!category) return; // invalid slug — bail out early

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchProducts(category);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

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

  // ── Invalid category slug ─────────────────────────────────────────────────────
  if (!category) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Category not found</h4>
        <p className="text-muted">
          Valid categories: {CATEGORIES.join(', ')}
        </p>
        <Link to="/" className="btn btn-dark mt-2">← Back to All Products</Link>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading {category}…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <strong>⚠️ Error:</strong> {error}
          <br />
          <button
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Product Grid ──────────────────────────────────────────────────────────────
  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">All Products</Link>
          </li>
          <li className="breadcrumb-item active fw-semibold">{category}</li>
        </ol>
      </nav>

      <div className="mb-4">
        <h2 className="fw-bold mb-1">{category}</h2>
        <p className="text-muted mb-0">{products.length} item(s) available</p>
      </div>

      {/* Quick-jump to other categories */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {CATEGORIES.filter((c) => c !== category).map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat.toLowerCase()}`}
            className="btn btn-sm btn-outline-secondary"
          >
            {cat}
          </Link>
        ))}
        <Link to="/" className="btn btn-sm btn-outline-dark">
          All Products
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No products in this category yet.</p>
          <Link to="/" className="btn btn-dark mt-2">← Back to All Products</Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 border-0 shadow-sm">

                <Link to={`/product/${product._id}`} className="text-decoration-none">
                  <div className="overflow-hidden" style={{ height: '210px' }}>
                    <img
                      src={product.image}
                      className="card-img-top w-100 h-100"
                      alt={product.name}
                      style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image'; }}
                    />
                  </div>
                </Link>

                <div className="card-body d-flex flex-column p-3">
                  <span className="badge bg-secondary mb-1" style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                    {product.category}
                  </span>
                  <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                    <h6 className="fw-bold mb-1">{product.name}</h6>
                  </Link>
                  <p className="text-muted small flex-grow-1 mb-2">{product.description}</p>
                  <div className="text-warning small mb-3">★★★★☆</div>

                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <span className="fw-bold text-dark fs-6">₹{product.price.toLocaleString()}</span>
                    <div className="d-flex gap-2">
                      <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-dark">
                        Details
                      </Link>
                      <button
                        className={`btn btn-sm ${addedId === product._id ? 'btn-success' : 'btn-dark'}`}
                        onClick={() => handleAdd(product)}
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
  );
};

export default CategoryPage;
