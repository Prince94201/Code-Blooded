import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { User } from '@/types/api';

interface AuthRouteProps {
  children: ReactNode;
  user: User | null | undefined;
}

const AuthRoute = ({ children, user }: AuthRouteProps) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
