import { createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from 'react';
import { useCarsAvailabilitySchedule } from '@services/fetchers/useCarsAvailabilitySchedule.ts';
import { getEndDateOf, getStartDateOf } from '@/services/helpers/time.ts';
import { CarAvailabilityScheduleType } from '@services/types/cars.ts';

type ContextType = {
  isLoading: boolean;
  setStartDate: (date: Date) => void;
  setMonthSearchParams: Dispatch<SetStateAction<{ dateFrom: string; dateTo: string }>>;
  startDate: Date;
  availabilityScheduleMonth: CarAvailabilityScheduleType[];
  availabilityScheduleDay: CarAvailabilityScheduleType[];
  monthSearchParams: { dateFrom: string; dateTo: string };
  reFetchSchedule: () => void;
};

interface Props extends PropsWithChildren {
  id: string;
}

export const CarAvailabilityContext = createContext<ContextType>({} as ContextType);

const CartAvailabilityProvider: React.FC<Props> = ({ children, id }): JSX.Element => {
  const [startDate, setStartDate] = useState<Date>(new Date(getStartDateOf('', 'day').format('MMMM DD, YYYY, hh:mm A')));
  const [monthSearchParams, setMonthSearchParams] = useState({
    dateFrom: getStartDateOf('', 'month').parseZone().tz('America/New_York', true).toISOString(),
    dateTo: getEndDateOf('', 'month').parseZone().tz('America/New_York', true).toISOString(),
  });

  const [daySearchParams, setDaySearchParams] = useState({
    dateFrom: getStartDateOf('', 'day').toISOString(),
    dateTo: getEndDateOf('', 'day').toISOString(),
  });
  const {
    availabilitySchedule: availabilityScheduleMonth,
    isLoading: isMonthLoading,
    reFetch: reFetchMonthSchedule,
  } = useCarsAvailabilitySchedule({
    carId: id,
    searchParams: monthSearchParams,
  });
  const {
    availabilitySchedule: availabilityScheduleDay,
    isLoading: isDayLoading,
    reFetch: reFetchDaySchedule,
  } = useCarsAvailabilitySchedule({
    carId: id,
    searchParams: daySearchParams,
  });

  useEffect(() => {
    setDaySearchParams({
      dateFrom: getStartDateOf(startDate, 'day').parseZone().tz('America/New_York', true).toISOString(),
      dateTo: getEndDateOf(startDate, 'day').parseZone().tz('America/New_York', true).toISOString(),
    });
  }, [startDate]);

  const reFetchSchedule = (): void => {
    reFetchMonthSchedule();
    reFetchDaySchedule();
  };

  return (
    <CarAvailabilityContext.Provider
      value={{
        isLoading: isMonthLoading || isDayLoading,
        startDate,
        setStartDate,
        monthSearchParams,
        setMonthSearchParams,
        availabilityScheduleMonth,
        availabilityScheduleDay,
        reFetchSchedule,
      }}
    >
      {children}
    </CarAvailabilityContext.Provider>
  );
};

export default CartAvailabilityProvider;
