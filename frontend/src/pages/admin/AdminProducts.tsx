import { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getErrorMessage,
  CATEGORIES,
} from '../../services/api';
import type { BackendProduct, Category } from '../../services/api';

// Empty form state — includes category now
const emptyForm = { name: '', price: '', description: '', image: '', category: 'Accessories' as Category };

const AdminProducts = () => {
  const [allProducts, setAllProducts] = useState<BackendProduct[]>([]);
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [saving, setSaving]     = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  // ── Load ALL products once on mount ───────────────────────────────────────
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchProducts(); // no filter — load all
      setAllProducts(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Filter locally for the admin table (no extra network call)
  const displayedProducts =
    filterCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category === filterCategory);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
    setFormError('');
  };

  // Pre-fill form for editing
  const handleEdit = (product: BackendProduct) => {
    setFormData({
      name:        product.name,
      price:       String(product.price),
      description: product.description,
      image:       product.image,
      category:    product.category ?? 'Accessories',
    });
    setEditId(product._id);
    setShowForm(true);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(_id);
      setAllProducts((prev) => prev.filter((p) => p._id !== _id));
    } catch (err) {
      alert('Delete failed: ' + getErrorMessage(err));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      setFormError('Product name and price are required.');
      return;
    }

    const payload = {
      name:        formData.name.trim(),
      price:       Number(formData.price),
      description: formData.description.trim(),
      image:       formData.image.trim() || 'https://placehold.co/400x300?text=Product',
      category:    formData.category,
    };

    try {
      setSaving(true);
      setFormError('');
      if (editId) {
        const res = await updateProduct(editId, payload);
        setAllProducts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
      } else {
        const res = await createProduct(payload);
        setAllProducts((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark mb-3" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted">Loading products…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <strong>⚠️ Error:</strong> {error}
          <br />
          <button className="btn btn-sm btn-outline-danger mt-2" onClick={loadProducts}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h2 className="fw-bold mb-0">Manage Products</h2>
        <button
          className="btn btn-dark px-4 fw-semibold"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Add Product
        </button>
      </div>
      <p className="text-muted mb-3">{allProducts.length} product(s) in catalog</p>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">
              {editId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h6>

            {formError && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                ⚠️ {formError}
              </div>
            )}

            <div className="row g-3">
              {/* Name */}
              <div className="col-12 col-sm-6">
                <label htmlFor="adminProdName" className="form-label fw-semibold">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="adminProdName"
                  className="form-control"
                  placeholder="e.g. Sony WH-1000XM5"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={saving}
                />
              </div>

              {/* Price */}
              <div className="col-12 col-sm-6">
                <label htmlFor="adminProdPrice" className="form-label fw-semibold">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="adminProdPrice"
                  className="form-control"
                  placeholder="e.g. 2499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={saving}
                />
              </div>

              {/* Category dropdown */}
              <div className="col-12 col-sm-6">
                <label htmlFor="adminProdCategory" className="form-label fw-semibold">
                  Category *
                </label>
                <select
                  id="adminProdCategory"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  disabled={saving}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="col-12 col-sm-6">
                <label htmlFor="adminProdImage" className="form-label fw-semibold">
                  Image URL
                </label>
                <input
                  type="text"
                  id="adminProdImage"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  disabled={saving}
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label htmlFor="adminProdDesc" className="form-label fw-semibold">
                  Description
                </label>
                <input
                  type="text"
                  id="adminProdDesc"
                  className="form-control"
                  placeholder="Short product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={saving}
                />
              </div>

              {/* Buttons */}
              <div className="col-12 d-flex gap-2">
                <button
                  className="btn btn-dark px-4 fw-semibold"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    editId ? 'Update Product' : 'Add Product'
                  )}
                </button>
                <button className="btn btn-outline-secondary px-4" onClick={resetForm} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Filter Bar ── */}
      <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
        <span className="text-muted small fw-semibold me-1">Filter:</span>
        <button
          className={`btn btn-sm ${filterCategory === 'All' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setFilterCategory('All')}
        >
          All ({allProducts.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              className={`btn btn-sm ${filterCategory === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Products Table ── */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>
                {filterCategory === 'All'
                  ? <>No products yet. Click <strong>+ Add Product</strong> to get started.</>
                  : <>No products in <strong>{filterCategory}</strong> yet.</>}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3 text-muted small fw-semibold">#</th>
                    <th className="py-3 text-muted small fw-semibold">Image</th>
                    <th className="py-3 text-muted small fw-semibold">Name</th>
                    <th className="py-3 text-muted small fw-semibold">Category</th>
                    <th className="py-3 text-muted small fw-semibold">Description</th>
                    <th className="py-3 text-muted small fw-semibold">Price</th>
                    <th className="py-3 text-muted small fw-semibold text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-4 text-muted small">{index + 1}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/50x40?text=Img'; }}
                        />
                      </td>
                      <td className="fw-semibold small">{product.name}</td>
                      <td>
                        <span className="badge bg-secondary" style={{ fontSize: '0.72rem' }}>
                          {product.category}
                        </span>
                      </td>
                      <td className="text-muted small" style={{ maxWidth: '180px' }}>
                        <span className="text-truncate d-block">{product.description}</span>
                      </td>
                      <td className="fw-bold small">₹{product.price.toLocaleString()}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
