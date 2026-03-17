import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

/**
 * Route guard that redirects unauthenticated users to login,
 * and optionally restricts by role.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RequireRole({
  roles,
  children,
}: {
  roles: string | string[];
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasRole, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(roles)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
