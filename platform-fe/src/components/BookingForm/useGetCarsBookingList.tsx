import { useAxios } from '@/api/useAxios';
import { useQuery } from '@tanstack/react-query';

type Props = {
  pickupDate: string;
  returnDate: string;
  enabled: boolean;
};

interface Car {
  id: number;
  make: string;
  model: string;
  price: string;
  normalImageUrl: string;
  normalImageKey: string;
  hoverImageUrl: string;
  hoverImageKey: string;
  isAvailable: boolean;
}

type Return = {
  carsBookingList?: Car[];
  isCarsBookIstLoading: boolean;
};

export const useGetCarsBookingList = ({ pickupDate, returnDate, enabled }: Props): Return => {
  const { api } = useAxios();
  const params = new URLSearchParams({ dateFrom: pickupDate, dateTo: returnDate }).toString();

  async function fetchCarsBookingList(): Promise<Car[]> {
    const {
      data: { vehicles },
    }: { data: { vehicles: Car[] } } = await api.get(`/vehicles/platform/availability?${params}`);
    return vehicles;
  }

  const { data: carsBookingList, isLoading: isCarsBookIstLoading } = useQuery({
    queryKey: ['carsBookingList', params],
    queryFn: fetchCarsBookingList,
    enabled,
  });
  return { carsBookingList, isCarsBookIstLoading };
};
