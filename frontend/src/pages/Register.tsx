import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      // On success, redirect to login
      navigate('/login');
    } catch (err: unknown) {
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
        setError('Registration failed. Please try again.');
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
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="text-muted small">Join NextBuy and start shopping</p>
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
                  <label htmlFor="registerName" className="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="registerName"
                    className="form-control"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label fw-semibold">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="registerPassword"
                    className="form-control"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="registerConfirm" className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="registerConfirm"
                    className="form-control"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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
                      Creating account…
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <hr className="my-3" />

              <p className="text-center text-muted small mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-dark fw-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
