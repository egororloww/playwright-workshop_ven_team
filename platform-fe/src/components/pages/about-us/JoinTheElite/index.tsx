import { Container, Title } from '@/components';
import webp from '@images/about-us/au3.png';
import png from '@images/about-us/au3.png';
import { ReactComponent as Phone } from '@icons/contacts/phone.svg';
import { ReactComponent as Mail } from '@icons/contacts/mail.svg';
import classes from './index.module.scss';

export const JoinTheElite = (): JSX.Element => {
  return (
    <Container>
      <section className={classes.body}>
        <div className={classes.image}>
          <picture>
            <source srcSet={webp} type="image/webp" />
            <img src={png} alt="EFG Image" width={555} height={321} loading="lazy" />
          </picture>
        </div>
        <article className={classes.content}>
          <div className={classes.content__block}>
            <Title component="h2">Join the Elite</Title>
            <div className={classes.content__text}>
              <p>
                With Elite Fleet Group, you're not just renting a luxury car; you're indulging in an elite experience that sets a new standard in
                luxury car rentals. We invite you to discover the ultimate in sophistication and service with us.
              </p>
            </div>
          </div>
          <div className={classes.content__block}>
            <Title component="h2">Contact Us</Title>
            <div className={classes.content__text}>
              <p>
                Embark on an unparalleled journey today. Contact Elite Fleet Group to reserve your luxury vehicle and step into a world where your
                satisfaction is our highest priority.
              </p>
            </div>
            <div className={classes.contacts}>
              <a className={classes.contacts__link} href={`tel:${import.meta.env.VITE_APP_PHONE}`}>
                <Phone />
                <span>{import.meta.env.VITE_APP_PHONE}</span>
              </a>
              <a className={classes.contacts__link} href="mailto:Info@Elitefleetgroup.com">
                <Mail />
                <span>{import.meta.env.VITE_APP_EMAIL}</span>
              </a>
            </div>
          </div>
        </article>
      </section>
    </Container>
  );
};

export default JoinTheElite;
