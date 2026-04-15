// ─── Auth Helper Functions ────────────────────────────────────────────────────
// These are plain functions that read directly from localStorage.
// They work anywhere in the app — no need for React context or hooks.

export interface AuthUser {
  id: string;       // Backend returns string (MongoDB ObjectId)
  email: string;
  isAdmin: boolean;
}

// Get the currently logged-in user, or null if not logged in.
export const getUser = (): AuthUser | null => {
  const stored = localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
};

// Returns true if a JWT token exists in localStorage.
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Returns true if the logged-in user has admin privileges.
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.isAdmin === true;
};

// Get the raw JWT token string.
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Save token and user to localStorage after login.
export const saveAuth = (token: string, user: AuthUser): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear all auth data from localStorage (used on logout).
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
