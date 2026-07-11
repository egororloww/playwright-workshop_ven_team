import { AuthLayout } from '@/components';
import { useAuth } from '@/context/hooks/useAuth';
import { Login } from '@/pages';
import { PropsWithChildren, ReactNode } from 'react';

export const PrivateRoute = ({ children }: PropsWithChildren): ReactNode => {
  const { isAuthenticated, isRefreshPending } = useAuth();
  if (isRefreshPending) {
    return null;
  }
  return isAuthenticated && !isRefreshPending ? (
    children
  ) : (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};
