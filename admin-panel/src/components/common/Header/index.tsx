import { PropsWithChildren } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { ReactComponent as BurgerIcon } from '@icons/burger.svg';
import classes from './index.module.scss';
import { Sidebar } from '../Sidebar';
import { useDrawer } from '@/services/hooks/useDrawer';

export const Header = ({ children }: PropsWithChildren): JSX.Element => {
  const { open, handleClose, handleOpen } = useDrawer();

  return (
    <header className={classes.header}>
      <button className={classes.header__button} onClick={handleOpen}>
        <BurgerIcon />
      </button>
      {children}
      <Drawer
        open={open}
        direction="left"
        className={classes.drawer}
        overlayClassName={classes.overlay}
        lockBackgroundScroll={false}
        overlayOpacity={0.2}
        onClose={handleClose}
      >
        <Sidebar closeDrawer={handleClose} />
      </Drawer>
    </header>
  );
};
