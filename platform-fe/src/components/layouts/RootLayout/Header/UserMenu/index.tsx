import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { ReactComponent as Chevron } from '@icons/chevron-down-bold.svg';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import classes from './index.module.scss';
import { NavLink, useLocation } from 'react-router-dom';

type Props = {
  logout: () => void;
};

export const UserMenu = ({ logout }: Props): JSX.Element => {
  const { pathname } = useLocation();
  const isActive = pathname === '/profile' || pathname === '/profile/edit' || pathname === '/booking/list';
  return (
    <Menu
      menuButton={
        <MenuButton className={`${classes.button} ${isActive ? classes.button__active : ''}`}>
          <span>Account</span> <Chevron />
        </MenuButton>
      }
      transition
      position="auto"
      direction="bottom"
      align="center"
      gap={6}
      viewScroll="close"
      menuClassName={classes.menu}
    >
      <MenuItem className={classes.menu__item}>
        <NavLink to="booking/list">My Bookings</NavLink>
      </MenuItem>
      <MenuItem className={classes.menu__item}>
        <NavLink to="/profile">Profile</NavLink>
      </MenuItem>
      <MenuItem onClick={logout} role="button" className={classes.menu__item}>
        Logout
      </MenuItem>
    </Menu>
  );
};
