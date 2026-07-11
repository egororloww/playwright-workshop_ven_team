import { ReactNode } from 'react';
import classes from './index.module.scss';
import { Line } from '@/components/Line';
import { Title } from '@/components/Title';
import { Container } from '@/components/Container';

export const AboutUsHeader = (): ReactNode => (
  <Container>
    <div className={classes.header}>
      <Line>
        <Title component="h1" className={classes.title}>
          About us
        </Title>
      </Line>
      <p className={classes.header__description}>
        Welcome to Elite Fleet Group, the epitome of luxury car rentals in Miami, Ft. Lauderdale, and Palm Beach. Established in 2019, we are
        committed to delivering an unrivaled automotive experience for those who demand nothing but the best.
      </p>
    </div>
  </Container>
);
