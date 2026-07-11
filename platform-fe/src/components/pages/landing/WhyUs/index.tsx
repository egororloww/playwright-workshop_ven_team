import { Container, Line, Title } from '@/components';
import webp from '@images/why-us/why-us.webp';
import png from '@images/why-us/why-us.png';
import classes from './index.module.scss';
import { List } from './List';

export const WhyUs = (): JSX.Element => {
  return (
    <Container>
      <section className={classes.body}>
        <article className={classes.content}>
          <Line position="right">
            <Title component="h2">Why Us</Title>
          </Line>
          <List />
        </article>
        <div className={classes.image}>
          <picture>
            <source srcSet={webp} type="image/webp" />
            <img src={png} alt="EFG Image" width={555} height={321} loading="lazy" />
          </picture>
        </div>
      </section>
    </Container>
  );
};

export default WhyUs;
