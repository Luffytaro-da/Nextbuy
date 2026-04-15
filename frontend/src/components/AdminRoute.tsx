import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

// AdminRoute — only lets admin users through.
// - Not logged in at all?  → redirect to /login
// - Logged in but not admin? → redirect to / (home)
// - Logged in AND admin?   → show the page
const AdminRoute = ({ children }: Props) => {
  const { isLoggedIn, user } = useAuth();

  // Step 1: must be logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Step 2: must be an admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
