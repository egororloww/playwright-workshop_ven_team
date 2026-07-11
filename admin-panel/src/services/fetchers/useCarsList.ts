import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CarListType, CarType, DataCarListType } from '@services/types/cars';

export const useCarsList = (): { carsList: CarType[] } => {
  const { api } = useAxios();
  async function fetchCarsList(): Promise<CarListType> {
    const {
      data: { vehicles },
    }: { data: DataCarListType } = await api.get(`/vehicles/admin`);
    return vehicles;
  }
  const { data: carsList }: UseSuspenseQueryResult<CarListType, Error> = useSuspenseQuery({
    queryKey: ['cars', 'list'],
    queryFn: fetchCarsList,
  });
  return { carsList };
};
