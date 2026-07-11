import { NavLink } from 'react-router-dom';
import { Typography } from '../Typography';
import { ReactComponent as NavIcon1 } from '@/assets/icons/sidebar/cars.svg';
import { ReactComponent as NavIcon2 } from '@/assets/icons/sidebar/bookings.svg';
import { ReactComponent as NavIcon3 } from '@/assets/icons/sidebar/customers.svg';
import { ReactComponent as NavIcon4 } from '@/assets/icons/sidebar/raffle.svg';
import { ReactComponent as LogoutIcon } from '@/assets/icons/sidebar/logout.svg';
import { ReactComponent as LogoIcon } from '@/assets/icons/logo.svg';
import { ReactComponent as LogoMobileIcon } from '@/assets/icons/logo-mobile.svg';
import classes from './index.module.scss';
import { Modal } from '../Modal';
import { useModal } from '../Modal/useModal';
import { ModalContent } from './ModalContent';
import { ReactComponent as BurgerCloseIcon } from '@icons/burger-close.svg';

type Props = {
  closeDrawer?: () => void;
};

export const Sidebar = ({ closeDrawer }: Props): JSX.Element => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebar__header}>
        <LogoIcon />
        <Typography color="white" size="regular" textWeight="700" component="h1">
          Admin Panel
        </Typography>
      </div>
      <div className={classes.sidebar__drawer}>
        <button onClick={closeDrawer}>
          <BurgerCloseIcon />
        </button>
        <LogoMobileIcon />
      </div>
      <nav className={classes.sidebar__nav}>
        <NavLink className={classes.sidebar__link} to={'/cars'}>
          <NavIcon1 />
          <Typography textWeight="500" size="md" color="white" component="span">
            Cars
          </Typography>
        </NavLink>
        <NavLink className={classes.sidebar__link} to={'/bookings'}>
          <NavIcon2 />
          <Typography textWeight="500" size="md" color="white" component="span">
            Bookings
          </Typography>
        </NavLink>
        <NavLink className={classes.sidebar__link} to={'/customers'}>
          <NavIcon3 />
          <Typography textWeight="500" size="md" color="white" component="span">
            Customers
          </Typography>
        </NavLink>
        <NavLink className={classes.sidebar__link} to={'/raffle'}>
          <NavIcon4 />
          <Typography textWeight="500" size="md" color="white" component="span">
            Raffle
          </Typography>
        </NavLink>
      </nav>
      <div className={classes.sidebar__footer}>
        <button onClick={openModal} className={classes.sidebar__link}>
          <LogoutIcon />
          <Typography textWeight="500" size="md" color="white" component="span">
            Logout
          </Typography>
        </button>
      </div>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <ModalContent closeModal={closeModal} />
      </Modal>
    </div>
  );
};
