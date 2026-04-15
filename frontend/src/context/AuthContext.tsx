import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../services/authHelpers';
import { saveAuth, clearAuth } from '../services/authHelpers';

// ─── Context Type ─────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;        // The logged-in user object
  token: string | null;         // The JWT token string
  isLoggedIn: boolean;          // true if token exists
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (updated: Partial<AuthUser>) => void; // patch user without re-login
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // Read from localStorage on first load so session survives page refresh
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  });

  // Called after a successful login API call
  const login = (newToken: string, newUser: AuthUser) => {
    saveAuth(newToken, newUser);  // saves to localStorage
    setToken(newToken);
    setUser(newUser);
  };

  // Called when user clicks Logout
  const logout = () => {
    clearAuth();                  // removes from localStorage
    setToken(null);
    setUser(null);
  };

  // Patch the in-memory user and keep localStorage in sync (no re-login needed)
  const updateUser = (updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
// Use this inside any React component: const { user, isLoggedIn } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
