import { Container, Line, PageWrapper, Title } from '@/components';
import classes from './index.module.scss';
import { ReactNode } from 'react';
import { BookingDetailsInfo } from '../BookingDetailsInfo';

export const BookingDetailsContent = (): ReactNode => (
  <PageWrapper>
    <Container>
      <div className={classes.content}>
        <Line position="both">
          <Title className={classes.title}>My Bookings</Title>
        </Line>
        <BookingDetailsInfo />
      </div>
    </Container>
  </PageWrapper>
);
