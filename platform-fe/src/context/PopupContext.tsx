import { PopupContextType } from '@/services/types/popup';
import { PropsWithChildren, createContext, useMemo, useState } from 'react';

export const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = (): void => {
    setIsPopupOpen(true);
  };
  const closePopup = (): void => {
    setIsPopupOpen(false);
  };

  const value = useMemo(() => ({ isPopupOpen, openPopup, closePopup }), [isPopupOpen]);

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};
