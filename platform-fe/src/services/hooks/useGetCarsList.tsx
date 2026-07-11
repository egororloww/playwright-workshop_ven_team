import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CarType } from '@/services/types/car';
import { useAxios } from '@/api/useAxios';

type Props = {
  endpoint: string;
  queryKey: string[];
};

type CarsData = {
  data: { vehicles: CarType[] };
};

export const useGetCarsList = ({ endpoint, queryKey }: Props): UseSuspenseQueryResult<CarType[], Error> => {
  const { api } = useAxios();

  async function fetchCarsList(): Promise<CarType[]> {
    const {
      data: { vehicles },
    }: CarsData = await api.get(endpoint);
    return vehicles;
  }
  return useSuspenseQuery({ queryKey, queryFn: fetchCarsList, staleTime: Infinity });
};
