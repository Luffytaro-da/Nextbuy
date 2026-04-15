import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../services/api';

const Navbar = () => {
  const { cartCount, clearCart } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  // Category dropdown state
  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🛒 NextBuy
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Left links */}
          <ul className="navbar-nav me-auto ms-3 align-items-lg-center gap-lg-1">

            {/* Products */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                to="/"
                end
              >
                Products
              </NavLink>
            </li>

            {/* Categories dropdown — pure React, no Bootstrap JS */}
            <li
              className="nav-item"
              style={{ position: 'relative' }}
              ref={dropdownRef}
            >
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer',
                  padding: '0.5rem 0.5rem',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onClick={() => setCatOpen((prev) => !prev)}
              >
                Categories
                <span style={{ fontSize: '0.7rem' }}>{catOpen ? '▲' : '▼'}</span>
              </button>

              {catOpen && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 9999,
                    listStyle: 'none',
                    margin: 0,
                    padding: '0.25rem 0',
                    backgroundColor: '#212529',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '0.375rem',
                    minWidth: '160px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/category/${cat.toLowerCase()}`}
                        onClick={() => setCatOpen(false)}
                        style={{
                          display: 'block',
                          padding: '0.5rem 1rem',
                          color: 'rgba(255,255,255,0.85)',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#343a40')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Orders — only if logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                  to="/orders"
                >
                  Orders
                </NavLink>
              </li>
            )}

            {/* Admin link — ONLY for admin users */}
            {isLoggedIn && user?.isAdmin && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                  to="/admin"
                >
                  🛠️ Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right links */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            {/* Cart */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  'nav-link position-relative' + (isActive ? ' active fw-semibold' : '')
                }
                to="/cart"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            <li className="nav-item d-none d-lg-block">
              <span className="text-secondary">|</span>
            </li>

            {/* Logged in: show user email + Logout */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                    to="/profile"
                  >
                    👤 {user?.email?.split('@')[0] ?? 'Profile'}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-outline-light btn-sm px-3" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
