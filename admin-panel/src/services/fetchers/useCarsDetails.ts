import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CarDetailsType } from '@services/types/cars';

export const useCarDetails = (carId: string): { carDetails: CarDetailsType } => {
  const { api } = useAxios();
  async function fetchCarDetails(): Promise<CarDetailsType> {
    const {
      data: { vehicles },
    }: { data: { vehicles: CarDetailsType } } = await api.get(`/vehicles/${carId}/admin`);
    return vehicles;
  }
  const { data: carDetails }: UseSuspenseQueryResult<CarDetailsType, Error> = useSuspenseQuery({
    queryKey: ['cars', carId],
    queryFn: fetchCarDetails,
  });
  return { carDetails };
};
