import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;

      // Save token + user in context (also saves to localStorage)
      login(token, user);

      // Admins go to dashboard, regular users go to home
      navigate(user.isAdmin ? '/admin' : '/');
    } catch (err: unknown) {
      // Show backend error message if available, otherwise a generic message
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError(String((err.response.data as { message: string }).message));
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to your NextBuy account</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  ⚠️ {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label fw-semibold">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Signing in…
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <hr className="my-3" />

              <p className="text-center text-muted small mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-dark fw-semibold">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
