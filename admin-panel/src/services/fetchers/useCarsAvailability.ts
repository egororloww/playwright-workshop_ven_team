import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CarUnavailableHoursType } from '@services/types/cars';

export const useCarAvailability = (carId: string): { unavailableHours: CarUnavailableHoursType[] } => {
  const { api } = useAxios();
  async function fetchCarAvailability(): Promise<CarUnavailableHoursType[]> {
    const {
      data: { vehiclesUnavailableHours },
    }: { data: { vehiclesUnavailableHours: CarUnavailableHoursType[] } } = await api.get(`/vehiclesUnavailableHours/vehicle/${carId}`);
    return vehiclesUnavailableHours;
  }
  const { data: unavailableHours }: UseSuspenseQueryResult<CarUnavailableHoursType[], Error> = useSuspenseQuery({
    queryKey: ['car availability', carId.toString()],
    queryFn: fetchCarAvailability,
  });
  return { unavailableHours };
};
