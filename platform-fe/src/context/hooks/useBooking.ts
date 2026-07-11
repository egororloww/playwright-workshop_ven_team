import { BookingContextType } from '@/services/types/booking';
import { BookingContext } from './../BookingContext';
import { useContext } from 'react';

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingContextType');
  }
  return context;
};
