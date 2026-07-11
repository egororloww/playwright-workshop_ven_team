import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/Sidebar';
import classes from './index.module.scss';

export const RootLayout = (): ReactNode => (
  <div className={classes.root}>
    <aside className={classes.root__sidebar}>
      <Sidebar />
    </aside>
    <div className={classes.root__content}>
      <Outlet />
    </div>
  </div>
);
