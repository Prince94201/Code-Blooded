import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ReactNode } from 'react';
import { User } from '@/types/api';

interface ProtectedRouteProps {
  children: ReactNode;
  user: User | null | undefined;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, user, requireAdmin = false }: ProtectedRouteProps) => {
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
