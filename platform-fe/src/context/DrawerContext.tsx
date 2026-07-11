import { DrawerContextType } from '@/services/types/drawer';
import { PropsWithChildren, createContext, useMemo, useState } from 'react';

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = (): void => {
    setIsDrawerOpen(false);
  };
  const openDrawer = (): void => {
    setIsDrawerOpen(true);
  };

  const value = useMemo(() => ({ isDrawerOpen, closeDrawer, openDrawer }), [isDrawerOpen]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};
