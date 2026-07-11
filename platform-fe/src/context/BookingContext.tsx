/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PropsWithChildren, createContext, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { BookingContextType, BookingType, RentalParams } from '@/services/types/booking';

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [prebooking, setPrebooking] = useState<RentalParams>({} as RentalParams);

  const handlePrebooking = useCallback(
    ({ key, data }: { key: string; data: unknown }): void => {
      setPrebooking((prev) => {
        return {
          ...prev,
          [key]: data,
        };
      });
    },
    [setPrebooking]
  );

  const calculateFee = (fee?: number, amount?: number): number => {
    return amount && fee ? Number((((fee || 0) / 100) * amount).toFixed(2)) : 0;
  };

  const handleBookingReset = (): void => {
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('prebooking');
    setBooking(null);
    setPrebooking({} as RentalParams);
  };

  useLayoutEffect(() => {
    const newBookingString: string | null = sessionStorage.getItem('booking');
    const newBooking: BookingType | null = newBookingString ? (JSON.parse(newBookingString) as BookingType) : null;
    const prebookingString = sessionStorage.getItem('prebooking');
    const prebookingData: RentalParams = prebookingString ? JSON.parse(prebookingString) : {};

    setBooking(newBooking);
    setPrebooking(prebookingData);
  }, []);

  const value = useMemo(
    () => ({
      booking,
      setBooking,
      prebooking,
      setPrebooking,
      handlePrebooking,
      calculateFee,
      handleBookingReset,
    }),
    [booking, handlePrebooking, prebooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
