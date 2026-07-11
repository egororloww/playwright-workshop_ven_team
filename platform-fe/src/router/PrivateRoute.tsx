import { useAuth } from '@/context/hooks/useAuth';
import { PropsWithChildren, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }: PropsWithChildren): ReactNode => {
  const { isAuthenticated, isRefreshPending } = useAuth();
  if (isRefreshPending) {
    return null;
  }
  return isAuthenticated && !isRefreshPending ? children : <Navigate to="/" replace />;
};
