import { useAxios } from '@/api/useAxios';
import { useQuery } from '@tanstack/react-query';

type Props = {
  vehicleId: string | number;
  enabled: boolean;
};

type Return = {
  carsLocationsList?: RentalType;
  isCarsLocationsIstLoading: boolean;
};

interface PickupLocation {
  id: number;
  address: string;
  price: string;
}

interface DropOffLocation {
  id: number;
  address: string;
  price: string;
}

interface AdditionalService {
  id: number;
  name: string;
  price: string;
  code?: string;
}

interface Fees {
  processingFee: number;
}

interface RentalType {
  pickupLocations: PickupLocation[];
  dropOffLocations: DropOffLocation[];
  additionalServices: AdditionalService[];
  fees: Fees;
}

export const useGetLocationsList = ({ vehicleId, enabled }: Props): Return => {
  const { api } = useAxios();

  async function fetchLocationsList(): Promise<RentalType> {
    const {
      data: { vehicles },
    }: { data: { vehicles: RentalType } } = await api.get(`/vehicles/${vehicleId}/platform/parameters`);
    return vehicles;
  }

  const { data: carsLocationsList, isLoading: isCarsLocationsIstLoading } = useQuery({
    queryKey: ['locationsList', vehicleId || 'default'],
    queryFn: fetchLocationsList,
    enabled,
  });
  return { carsLocationsList, isCarsLocationsIstLoading };
};
