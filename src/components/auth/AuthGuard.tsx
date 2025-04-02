import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from './Loader';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<"super_admin" | "admin" | "employee">;
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log navigation
    console.log('AuthGuard: Navigating to', location.pathname);
    console.log('AuthGuard: User is', user);
    console.log('AuthGuard: Allowed roles are', allowedRoles);
  }, [location.pathname, user, allowedRoles]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if the user has one
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on role
    if (user.role === 'super_admin') {
      return <Navigate to="/admin/companies" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
