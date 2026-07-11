import { AuthContextType } from '@/services/types/auth';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDrawer must be used within a AuthProvider');
  }
  return context;
};
