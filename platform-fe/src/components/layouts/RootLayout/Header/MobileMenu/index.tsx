import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { ReactComponent as Close } from '@icons/close.svg';
import { ReactComponent as Logo } from '@icons/logo.svg';
import { Link, NavLink } from 'react-router-dom';

import classes from './index.module.scss';
import { Button, Line } from '@/components';

type Props = {
  isOpen: boolean;
  closeMenuDrawer: () => void;
  openBookingDrawer: () => void;
  openAuthPopup: () => void;
  isAuthenticated: boolean;
  logout: () => void;
};

export const MobileMenu = ({ isOpen, closeMenuDrawer, openBookingDrawer, openAuthPopup, isAuthenticated, logout }: Props): JSX.Element => {
  const openPopupHandler = (): void => {
    closeMenuDrawer();
    openAuthPopup();
  };
  const openBookingHandler = (): void => {
    closeMenuDrawer();
    openBookingDrawer();
  };
  const logoutHandler = (): void => {
    closeMenuDrawer();
    logout();
  };
  return (
    <div className={classes.wrapper}>
      <Drawer size="100vw" enableOverlay={false} open={isOpen} onClose={closeMenuDrawer} direction="right" className={classes.drawer}>
        <div className={classes.header}>
          <button className={classes.close} onClick={closeMenuDrawer}>
            <Close />
          </button>
          <Link to="/" onClick={closeMenuDrawer} className={classes.logo}>
            <Logo />
          </Link>
          <div className={classes.box}></div>
        </div>
        <div className={classes.navigation}>
          <NavLink onClick={closeMenuDrawer} to="/" className={`${classes.link}`}>
            <span>Home</span>
          </NavLink>
          <NavLink onClick={closeMenuDrawer} to="/our-cars" className={`${classes.link}`}>
            <span>Our Cars</span>
          </NavLink>

          {/* <NavLink onClick={closeMenuDrawer} to="/winners" className={`${classes.link}`}>
            <span>Winners</span>
          </NavLink> */}
          <NavLink onClick={closeMenuDrawer} to="/about-us" className={`${classes.link}`}>
            <span>About Us</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink onClick={closeMenuDrawer} to="booking/list" className={`${classes.link}`}>
                <span>My Bookings</span>
              </NavLink>
              <NavLink onClick={closeMenuDrawer} to="/profile" className={`${classes.link}`}>
                <span>Profile</span>
              </NavLink>
              <button onClick={logoutHandler} className={`${classes.link}`}>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button onClick={openPopupHandler} className={`${classes.link}`}>
              <span>Sign In</span>
            </button>
          )}
        </div>
        <Line>
          <Button textUppercase={true} onClick={openBookingHandler} fullWidth={false} size="lg">
            Book Now
          </Button>
        </Line>
      </Drawer>
    </div>
  );
};
