import { useAxios } from '@/api/useAxios';
import { BookingListType, BookingType, DataBookingListType } from '@services/types/bookings';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

export const useBookingsList = (): { bookingsList: BookingType[] } => {
  const { api } = useAxios();
  async function fetchBookingsList(): Promise<BookingListType> {
    const {
      data: { bookings },
    }: { data: DataBookingListType } = await api.get(`/bookings/list/admin`);
    return bookings;
  }
  const { data: bookingsList }: UseSuspenseQueryResult<BookingListType, Error> = useSuspenseQuery({
    queryKey: ['bookings', 'list'],
    queryFn: fetchBookingsList,
  });
  return { bookingsList };
};
