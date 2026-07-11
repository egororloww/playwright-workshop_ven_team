import { Container } from '@/components';
import { ReactComponent as Logo } from '@icons/logo.svg';
import { ReactComponent as Burger } from '@icons/burger.svg';
import classes from './index.module.scss';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { useDrawer } from '@/context/hooks/useDrawer';
import { usePopup } from '@/context/hooks/usePopup';
import { useAuth } from '@/context/hooks/useAuth';
import { UserMenu } from './UserMenu';

export const Header = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { openDrawer: openBookingDrawer } = useDrawer();
  const { openPopup: openAuthPopup } = usePopup();
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();

  const closeMenuDrawer = (): void => {
    setIsOpen(false);
  };
  const openMenuDrawer = (): void => {
    setIsOpen(true);
  };

  const bookingDisabled =
    pathname === '/booking/terms-and-conditions' ||
    pathname === '/booking/payment' ||
    pathname === '/booking/terms-and-conditions/' ||
    pathname === '/booking/payment/';
  return (
    <header className={classes.header}>
      <Container>
        <nav className={classes.navigation}>
          <div className={classes.line}>
            <svg viewBox="0 0 96 16" preserveAspectRatio="xMinYMin meet">
              <defs>
                <clipPath id="svgPath">
                  <path d="M-672 0.00015619C-672 0.00015619 5.5 0.000153945 14 0.00015619C31 0.00016068 48 13.0002 48 13.0002C48 13.0002 65 0.000178753 82 0.00015619C346.775 -0.000195237 768 0.00015619 768 0.00015619V1.00015C768 1.00015 346.775 1.00169 82 1.00015C65 1.00005 48 14.0002 48 14.0002C48 14.0002 31 1.00015 14 1.00015C7 1.00015 -672 1.00015 -672 1.00015V0.00015619Z" />
                </clipPath>
              </defs>

              <rect width="100%" height="100%" fill="white" clipPath="url(#svgPath)" />
            </svg>
          </div>
          <div className={classes.box}>
            <svg viewBox="0 0 50 12" preserveAspectRatio="xMinYMin meet">
              <defs>
                <clipPath id="svgPathBox">
                  <path d="M25 12C29.5 10 42 -0.970337 59 -0.970337H745V-81H-695V-0.970337H-9C8 -0.970337 20.5 10 25 12Z" />
                </clipPath>
              </defs>

              <rect width="100%" height="100%" fill="#080c0fcc" clipPath="url(#svgPathBox)" />
            </svg>
          </div>

          <button className={classes.burger} onClick={openMenuDrawer}>
            <Burger />
          </button>
          <NavLink to="/our-cars" className={`${classes.link} ${classes.link_white}`}>
            Our Cars
          </NavLink>

          {/* <NavLink to="/winners" className={`${classes.link} ${classes.link_white}`}>
            Winners
          </NavLink> */}
          <NavLink to="/about-us" className={`${classes.link} ${classes.link_white}`}>
            About Us
          </NavLink>
          <Link to="/" className={classes.logo}>
            <Logo />
          </Link>
          {isAuthenticated ? (
            <UserMenu logout={logout} />
          ) : (
            <button onClick={openAuthPopup} style={{ justifySelf: 'end' }} className={`${classes.link} ${classes.link_white}`}>
              Sign In
            </button>
          )}
          <button disabled={bookingDisabled} onClick={openBookingDrawer} className={`${classes.link} ${classes.link_accent}`}>
            Book Now
          </button>
          <div className={classes.triangle}></div>
        </nav>
      </Container>
      <MobileMenu
        isAuthenticated={isAuthenticated}
        logout={logout}
        openAuthPopup={openAuthPopup}
        isOpen={isOpen}
        closeMenuDrawer={closeMenuDrawer}
        openBookingDrawer={openBookingDrawer}
      />
    </header>
  );
};
