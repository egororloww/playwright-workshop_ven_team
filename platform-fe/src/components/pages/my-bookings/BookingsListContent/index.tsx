import { Container, Line, PageWrapper, Title } from '@/components';
import classes from './index.module.scss';
import { BookingsList } from '../BookingsList';

export const BookingsListContent = (): JSX.Element => (
  <PageWrapper>
    <Container>
      <div className={classes.content}>
        <Line position="both">
          <Title className={classes.title}>My Bookings</Title>
        </Line>
        <BookingsList />
      </div>
    </Container>
  </PageWrapper>
);
