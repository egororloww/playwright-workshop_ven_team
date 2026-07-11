import { Button, Container, Line, PageWrapper, Title } from '@/components';
import { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookingInfoType, DataBookingDataType } from '../../booking-details/BookingDetailsInfo';
import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import classes from './index.module.scss';

export const SuccessPaymentContent = (): ReactNode => {
  const { id } = useParams();
  const { api } = useAxios();

  async function fetchBookingsList(): Promise<BookingInfoType> {
    const {
      data: { bookings },
    }: { data: DataBookingDataType } = await api.get(`/bookings/${id}/platform`);
    return bookings;
  }

  const { data }: UseSuspenseQueryResult<BookingInfoType, Error> = useSuspenseQuery({
    queryKey: ['bookings', id],
    queryFn: fetchBookingsList,
    staleTime: Infinity,
  });

  const { vehicle } = data;

  const { normalImageUrl } = vehicle;
  return (
    <PageWrapper>
      <Container>
        <div className={classes.content}>
          <Line position="both">
            <Title className={classes.title}>Almost behind the wheel</Title>
          </Line>
          <div className={classes.container}>
            <div className={classes.image}>
              <img src={normalImageUrl} alt="Car" width={993} height={508} />
            </div>
            <p className={classes.text}>Booking #{id} is successfully created</p>
            <Button component={Link} to={`/booking/${id}`} textUppercase={true} textWeight="700" fullWidth={true}>
              booking info
            </Button>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
