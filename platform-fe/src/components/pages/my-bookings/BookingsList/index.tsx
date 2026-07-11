import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import classes from './index.module.scss';
import { BookingCard } from '../BookingCard';
import { useCallback, useRef, useState } from 'react';
import { AccentButton } from '@/components';
import { useDrawer } from '@/context/hooks/useDrawer';

export type BookingType = {
  id: number;
  pickupDate: Date;
  returnDate: Date;
  totalAmount: string;
  vehiclePrice: string;
  processingFee?: 3;
  createdAt: Date;
  vehicle: VehicleType;
  status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled';
};
type VehicleType = {
  id: number;
  make: string;
  model: string;
  normalImageUrl: string;
  normalImageKey: string;
};
type BookingListType = BookingType[];
type DataBookingListType = { bookings: BookingType[] };

export const BookingsList = (): JSX.Element => {
  const { api } = useAxios();
  const { openDrawer: openBookingDrawer } = useDrawer();
  async function fetchBookingsList(): Promise<BookingListType> {
    const {
      data: { bookings },
    }: { data: DataBookingListType } = await api.get(`/bookings/list/platform`);
    return bookings;
  }
  const { data }: UseSuspenseQueryResult<BookingListType, Error> = useSuspenseQuery({
    queryKey: ['bookings', 'list'],
    queryFn: fetchBookingsList,
  });

  const step = 5;

  const [bookings, setBookings] = useState(data ? [...data.slice(0, step)] : []);

  const observer: { current: IntersectionObserver | null } = useRef(null);

  const hasMore = data.length > bookings.length;

  const lastBookingRef = useCallback(
    (node: HTMLElement | null): void => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setBookings((prev) => [...data.slice(0, prev.length + step)]);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        }
      );
      if (node) {
        observer.current.observe(node);
      }
    },
    [data, hasMore]
  );

  return data && data.length ? (
    <ul className={classes.list}>
      {bookings.map(({ id, createdAt, pickupDate, returnDate, totalAmount, vehiclePrice, vehicle, status }: BookingType, index, self) => {
        if (self.length === index + 1) {
          return (
            <li ref={lastBookingRef} key={id} className={classes.list__item}>
              <BookingCard
                createdAt={createdAt}
                pickupDate={pickupDate}
                returnDate={returnDate}
                totalAmount={totalAmount}
                vehiclePrice={vehiclePrice}
                vehicle={vehicle}
                status={status}
                id={id}
              />
            </li>
          );
        } else {
          return (
            <li key={id} className={classes.list__item}>
              <BookingCard
                createdAt={createdAt}
                pickupDate={pickupDate}
                returnDate={returnDate}
                totalAmount={totalAmount}
                vehiclePrice={vehiclePrice}
                vehicle={vehicle}
                status={status}
                id={id}
              />
            </li>
          );
        }
      })}
    </ul>
  ) : (
    <div className={classes.warning}>
      <p className={classes.warning__text}>You haven’t made any bookings yet</p>
      <AccentButton onClick={openBookingDrawer} textUppercase={true} textWeight="700">
        Book a car
      </AccentButton>
    </div>
  );
};
