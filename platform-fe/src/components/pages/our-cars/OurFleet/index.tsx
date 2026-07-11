import { Container, Line, Title } from '@/components';
import { Marquee } from '../../../Marquee';
import { Cars } from './Cars';
import classes from './index.module.scss';
import { useGetCarsList } from '@/services/hooks/useGetCarsList';

export const OurFleet = (): JSX.Element => {
  const { data } = useGetCarsList({
    queryKey: ['cars-all'],
    endpoint: import.meta.env.VITE_APP_CARS_LIST_ENDPOINT,
  });

  return (
    <Container>
      <section className={classes.body}>
        <div className={classes.header}>
          <Line>
            <Title component="h1" className={classes.title}>
              our fleet
            </Title>
          </Line>
          <Marquee />
        </div>
        <Cars cars={data} />
      </section>
    </Container>
  );
};

export default OurFleet;
