import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (profile && !profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass p-8 rounded-xl max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Account Deactivated</h2>
          <p className="text-muted-foreground">
            Your account has been deactivated. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
