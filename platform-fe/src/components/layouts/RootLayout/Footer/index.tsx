import { Container } from '@/components';
import { ReactComponent as Logo } from '@icons/logo.svg';
import { ReactComponent as Instagram } from '@icons/contacts/instagram.svg';
import { ReactComponent as Facebook } from '@icons/contacts/facebook.svg';
import { ReactComponent as Phone } from '@icons/contacts/phone.svg';
import { ReactComponent as Mail } from '@icons/contacts/mail.svg';
import { ReactComponent as Pin } from '@icons/contacts/pin.svg';
import { Link, NavLink } from 'react-router-dom';
import classes from './index.module.scss';

export const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="xlg">
        <div className={classes.body}>
          <Link
            to="/"
            className={classes.logo}
            onClick={(): void => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
          >
            <Logo />
          </Link>
          <div className={classes.contacts}>
            <a className={classes.contacts__link} href={`tel:${import.meta.env.VITE_APP_PHONE}`}>
              <Phone />
              <span>{import.meta.env.VITE_APP_PHONE}</span>
            </a>
            <a className={classes.contacts__link} href="mailto:Info@Elitefleetgroup.com">
              <Mail />
              <span>{import.meta.env.VITE_APP_EMAIL}</span>
            </a>
            <a
              className={classes.contacts__link}
              href="https://maps.google.com/?q=66 W Flagler Street Miami FL,33130, United States"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pin />
              <span>
                66 W Flagler Street
                <br /> Miami FL, 33130, United States
              </span>
            </a>
          </div>
          <div className={classes.links}>
            <NavLink className={classes.links__link} to="/faq">
              FAQ
            </NavLink>
            <NavLink className={classes.links__link} to="/privacy-policy">
              PRIVACY POLICY
            </NavLink>
            <NavLink className={classes.links__link} to="/terms-and-conditions">
              Terms and Conditions
            </NavLink>
          </div>
          <div className={classes.social}>
            <div className={classes.social__list}>
              <a className={classes.social__link} href={import.meta.env.VITE_APP_INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <Instagram />
              </a>
              <a className={classes.social__link} href={import.meta.env.VITE_APP_FACEBOOK} target="_blank" rel="noopener noreferrer">
                <Facebook />
              </a>
            </div>
            <p className={classes.copyright}>© {year} ELITE FLEET GROUP. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
