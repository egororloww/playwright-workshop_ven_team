import { useContext } from 'react';
import { PopupContextType } from '@/services/types/popup';
import { PopupContext } from '../PopupContext';

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('useDrawer must be used within a PopupProvider');
  }
  return context;
};
