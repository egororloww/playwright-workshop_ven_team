import { Container, Title } from '@/components';
import webp from '@images/about-us/au2.png';
import png from '@images/about-us/au2.png';
import classes from './index.module.scss';

export const UnmatchedQuality = (): JSX.Element => {
  return (
    <Container>
      <section className={classes.body}>
        <article className={classes.content}>
          <div className={classes.content__block}>
            <Title component="h2">Unmatched Quality</Title>
            <div className={classes.content__text}>
              <p>
                Our commitment to quality extends beyond our fleet. Each car undergoes rigorous maintenance and thorough inspection to ensure top-tier
                performance and flawless condition. This meticulous attention to detail guarantees a driving experience that is both luxurious and
                worry-free.
              </p>
            </div>
          </div>
          <div className={classes.content__block}>
            <Title component="h2">Premier Service</Title>
            <div className={classes.content__text}>
              <p>
                Elite Fleet Group is more than just a car rental service; it's a gateway to a lifestyle of luxury and exclusivity. Our premier
                services include personalized consultations to match you with the perfect car for your needs, whether for a special event, business
                engagement, or leisure. Our team is devoted to providing you with a seamless experience from start to finish, ensuring every detail is
                catered to your preferences. From bespoke travel itineraries to 24/7 customer support, we go above and beyond to make your experience
                with us unforgettable.
              </p>
            </div>
          </div>
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

export default UnmatchedQuality;
