import { useAxios } from '@/api/useAxios';
import { BookingType } from '@services/types/bookings';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

export const useBookingInfo = (bookingId: string): { bookingInfo: BookingType } => {
  const { api } = useAxios();
  async function fetchBookingsList(): Promise<BookingType> {
    const {
      data: { bookings },
    }: { data: { bookings: BookingType } } = await api.get(`/bookings/${bookingId}/admin`);
    return bookings;
  }
  const { data: bookingInfo }: UseSuspenseQueryResult<BookingType, Error> = useSuspenseQuery({
    queryKey: ['booking', bookingId],
    queryFn: fetchBookingsList,
  });
  return { bookingInfo };
};
