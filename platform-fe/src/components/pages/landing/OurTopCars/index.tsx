import { Button, Container, Line, Title } from '@/components';
import { Marquee } from '../../../Marquee';
import { Cars } from './Cars';
import { Link } from 'react-router-dom';
import { ReactComponent as Banner } from '@images/our-cars.svg';
import classes from './index.module.scss';
import { Carousel } from './Carousel';
import { useGetCarsList } from '@/services/hooks/useGetCarsList';

export const OurTopCars = (): JSX.Element => {
  const { data } = useGetCarsList({
    queryKey: ['cars-all', 'random'],
    endpoint: import.meta.env.VITE_APP_CARS_LIST_RANDOM_ENDPOINT,
  });

  return (
    <Container maxWidth="xlg">
      <div className={classes.container}>
        <section className={classes.body}>
          <div className={classes.wrapper}>
            <div className={classes.header}>
              <div className={classes.header__top}>
                <Line position="right">
                  <Title component="h1" className={classes.title}>
                    Our TOP CARS
                  </Title>
                </Line>
                <Button
                  className={`${classes.button} ${classes.button__desktop}`}
                  textGradient="white"
                  fullWidth={false}
                  variant="outlined"
                  component={Link}
                  to={'/our-cars'}
                >
                  View All Cars
                </Button>
              </div>
              <Marquee />
            </div>
          </div>
          <div className={classes.cars}>
            <div className={classes.cars__list}>
              <div className={classes.cars__banner}>
                <Banner />
              </div>
              <Carousel cars={data} />
              <Cars cars={data} />
            </div>
            <Button
              className={`${classes.button} ${classes.button__mobile}`}
              textGradient="white"
              fullWidth={false}
              variant="outlined"
              component={Link}
              to={'/our-cars'}
            >
              View All Cars
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default OurTopCars;
