import { Button, Container, Title } from '@/components';
import webp from '@images/efg/efg.webp';
import png from '@images/efg/efg.png';
import { Link } from 'react-router-dom';
import classes from './index.module.scss';

export const EliteFG = (): JSX.Element => {
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
          <Title component="h2">ELITE FLEET GROUP</Title>
          <div className={classes.content__text}>
            <p>
              Welcome to Elite Fleet Group, the epitome of luxury car rentals in Miami, Ft. Lauderdale, and Palm Beach. Established in 2019, we are
              committed to delivering an unrivaled automotive experience for those who demand nothing but the best.
            </p>
            <p>
              Elite Fleet Group is synonymous with luxury, not just as a statement, but as a complete experience. We aim to provide our clients with
              an extraordinary journey, where the thrill of driving the world's most exclusive vehicles is matched only by our exceptional customer
              service.
            </p>
          </div>
          <Button className={classes.button} textGradient="white" fullWidth={false} variant="outlined" component={Link} to={'/about-us'}>
            Read More
          </Button>
        </article>
      </section>
    </Container>
  );
};

export default EliteFG;
