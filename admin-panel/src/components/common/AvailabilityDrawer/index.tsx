import { PropsWithChildren, ReactNode } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { ReactComponent as CloseIcon } from '@icons/close.svg';
import { Typography } from '../Typography';
import classes from './index.module.scss';

type ComponentProps = {
  title: string;
  handleClose: () => void;
  isOpen: boolean;
};

export const AvailabilityDrawer = ({ title, handleClose, children, isOpen }: PropsWithChildren<ComponentProps>): ReactNode => {
  return (
    <Drawer
      open={isOpen}
      direction="right"
      className={classes.drawer}
      zIndex={1002}
      overlayClassName={classes.overlay}
      lockBackgroundScroll={false}
      overlayOpacity={0.2}
      onClose={handleClose}
    >
      <button className={classes.drawer__button} onClick={handleClose}>
        <CloseIcon />
      </button>
      <Typography color="dark" textWeight="600" size="lg" className={classes.drawer__title} component="h3">
        {title}
      </Typography>
      <div className={classes.drawer__content}>{children}</div>
    </Drawer>
  );
};
