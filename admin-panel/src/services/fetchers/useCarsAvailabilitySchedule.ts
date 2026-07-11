/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useAxios } from '@/api/useAxios';
import { CarAvailabilityScheduleType, CarAvailabilitySearchParamsType } from '@services/types/cars';
import { useCallback, useEffect, useState } from 'react';

type PropsType = {
  carId: number | string;
  searchParams: CarAvailabilitySearchParamsType;
};

export const useCarsAvailabilitySchedule = ({
  carId,
  searchParams,
}: PropsType): { availabilitySchedule: CarAvailabilityScheduleType[]; isLoading: boolean; reFetch: () => void } => {
  const { api } = useAxios();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [availabilitySchedule, setAvailabilitySchedule] = useState<CarAvailabilityScheduleType[]>([]);

  async function fetchCarAvailabilitySchedule(searchParams: CarAvailabilitySearchParamsType): Promise<CarAvailabilityScheduleType[]> {
    const params = new URLSearchParams(searchParams);
    const {
      data: { vehicles },
    }: { data: { vehicles: CarAvailabilityScheduleType[] } } = await api.get(`/vehicles/${carId}/admin/availability/schedule?${params}`);
    return vehicles;
  }

  const getSchedule = useCallback(
    async (searchParams: CarAvailabilitySearchParamsType): Promise<void> => {
      setIsLoading(true);
      const result = await fetchCarAvailabilitySchedule(searchParams);
      setIsLoading(false);
      setAvailabilitySchedule(result);
    },
    [searchParams]
  );

  const fetchSchedule = (): void => {
    // eslint-disable-next-line no-console
    getSchedule(searchParams).catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchSchedule();
  }, [searchParams]);

  return { availabilitySchedule, isLoading, reFetch: fetchSchedule };
};
