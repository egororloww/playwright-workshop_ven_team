import { DrawerContextType } from '@/services/types/drawer';
import { DrawerContext } from './../DrawerContext';
import { useContext } from 'react';

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
