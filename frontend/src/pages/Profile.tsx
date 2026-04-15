import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getErrorMessage } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Helper: read/write phone+address from localStorage (not in DB)
  const storageKey = `profile_extra_${user?.id ?? 'guest'}`;
  const savedExtra = (() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? '{}'); } catch { return {}; }
  })();

  // Editable fields — pre-filled from the logged-in user
  const [name, setName]         = useState(user?.email?.split('@')[0] ?? '');
  const [email, setEmail]       = useState(user?.email ?? '');
  const [phone, setPhone]       = useState<string>(savedExtra.phone ?? '');
  const [address, setAddress]   = useState<string>(savedExtra.address ?? '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const payload: { name?: string; email?: string; password?: string } = {};
      if (name.trim())     payload.name     = name.trim();
      if (email.trim())    payload.email    = email.trim();
      if (password.trim()) payload.password = password.trim();

      const { data } = await updateProfile(payload);

      // Sync context + localStorage so navbar / other components see the new values
      updateUser({ email: data.email, isAdmin: data.isAdmin });

      // Persist phone + address in localStorage (not stored in DB)
      localStorage.setItem(storageKey, JSON.stringify({ phone: phone.trim(), address: address.trim() }));

      setPassword('');   // clear password field after save
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Use first part of email as display name
  const displayName  = user?.email?.split('@')[0] ?? 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">My Profile</h2>
      <p className="text-muted mb-4">Manage your account details</p>

      <div className="row g-4">

        {/* ── Left card: avatar + account info ── */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 text-center p-4">
            {/* Avatar circle */}
            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '90px', height: '90px', fontSize: '2rem', fontWeight: 700 }}
            >
              {avatarLetter}
            </div>

            <h5 className="fw-bold mb-1">{displayName}</h5>
            <p className="text-muted small mb-2">{user?.email}</p>

            {/* Role badge — admin vs customer */}
            <span className={`badge px-3 py-2 ${user?.isAdmin ? 'bg-danger' : 'bg-dark'}`}>
              {user?.isAdmin ? 'Admin' : 'Customer'}
            </span>

            <hr className="my-3" />

            <div className="text-start">
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">User ID</span>
                <span className="fw-semibold small text-truncate ms-2" style={{ maxWidth: '120px' }}>
                  {user?.id ?? '—'}
                </span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted small">Role</span>
                <span className="fw-semibold small">{user?.isAdmin ? 'Administrator' : 'Customer'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Status</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right card: edit form ── */}
        <div className="col-12 col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Edit Information</h5>

              {success && (
                <div className="alert alert-success py-2 mb-3" role="alert">
                  ✓ Profile updated successfully!
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  <div className="col-12 col-sm-6">
                    <label htmlFor="profileName" className="form-label fw-semibold">Display Name</label>
                    <input
                      type="text"
                      id="profileName"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="profileEmail" className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      id="profileEmail"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="profilePhone" className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      id="profilePhone"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="profilePassword" className="form-label fw-semibold">New Password</label>
                    <input
                      type="password"
                      id="profilePassword"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="profileAddress" className="form-label fw-semibold">Delivery Address</label>
                    <textarea
                      id="profileAddress"
                      className="form-control"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123, MG Road, Pune, Maharashtra - 411001"
                    />
                  </div>

                  <div className="col-12 d-flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="btn btn-dark px-4 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Saving…
                        </>
                      ) : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => {
                        setName(user?.email?.split('@')[0] ?? '');
                        setEmail(user?.email ?? '');
                        setPhone(savedExtra.phone ?? '');
                        setAddress(savedExtra.address ?? '');
                        setPassword('');
                        setError('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
