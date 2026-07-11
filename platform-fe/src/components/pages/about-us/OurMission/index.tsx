import { Container, Title } from '@/components';
import webp from '@images/about-us/au1.png';
import png from '@images/about-us/au1.png';
import classes from './index.module.scss';

export const OurMission = (): JSX.Element => {
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
            <Title component="h2">Our Mission</Title>
            <div className={classes.content__text}>
              <p>
                Elite Fleet Group is synonymous with luxury, not just as a statement but as a complete experience. We aim to provide our clients with
                an extraordinary journey where the thrill of driving the world's most exclusive vehicles is matched only by our exceptional customer
                service.
              </p>
            </div>
          </div>
          <div className={classes.content__block}>
            <Title component="h2">Our Fleet</Title>
            <div className={classes.content__text}>
              <p>
                At the heart of Elite Fleet Group is our meticulously curated collection of high-performance vehicles. Featuring illustrious brands
                such as Ferrari, Lamborghini, Porsche, and Rolls-Royce, each car is a masterpiece of engineering and design. We take pride in offering
                only low-mileage cars, ensuring that every vehicle you drive is in pristine condition, providing both luxury and reliability.
              </p>
            </div>
          </div>
        </article>
      </section>
    </Container>
  );
};

export default OurMission;
