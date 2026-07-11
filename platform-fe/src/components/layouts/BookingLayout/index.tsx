import { Container, Loader, PageWrapper } from '@/components';
import { useBooking } from '@/context/hooks/useBooking';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CarCardMobile } from './CarCardMobile';
import { CarCardDesktop } from './CarCardDesktop';
import { useAxios } from '@/api/useAxios';
import { useQuery } from '@tanstack/react-query';
import { calculateDifferenceBetweenTwoDates } from '@/services/helpers';
import { CarType } from '@/services/types/car';
import { ServiceType, VehicleParamsType } from '@/services/types/booking';
import classes from './index.module.scss';

export const BookingLayout = (): JSX.Element | null => {
  const { booking } = useBooking();

  const { api } = useAxios();

  const [isCar, setIsCar] = useState<boolean | null>(null);

  async function fetchVehicle(): Promise<CarType> {
    const {
      data: { vehicles },
    }: { data: { vehicles: CarType } } = await api.get(`/vehicles/${booking?.vehicleId}/platform/short`);
    return vehicles;
  }

  const { data: vehicle, isLoading: isVehicleLoading } = useQuery({
    queryKey: ['vehicleShort', booking?.vehicleId],
    queryFn: fetchVehicle,
    staleTime: Infinity,
    enabled: !!booking?.vehicleId,
  });

  async function fetchParams(): Promise<VehicleParamsType> {
    const {
      data: { vehicles },
    }: { data: { vehicles: VehicleParamsType } } = await api.get(`/vehicles/${booking?.vehicleId}/platform/parameters`);
    return vehicles;
  }

  const { data: params, isLoading: isParamsLoading } = useQuery({
    queryKey: ['locationsList', booking?.vehicleId || 'default'],
    queryFn: fetchParams,
    staleTime: Infinity,
    enabled: !!booking?.vehicleId,
  });

  useEffect(() => {
    const sessionStorageCar = sessionStorage.getItem('booking');
    setIsCar(!!sessionStorageCar);
    return () => {
      setIsCar(null);
    };
  }, []);

  if (isCar === false) {
    return <Navigate to="/" replace />;
  }

  if (!vehicle) {
    return <Loader />;
  }

  const services: ServiceType[] = booking?.additionalServices
    ? booking.additionalServices.reduce<ServiceType[]>((acc, serviceId) => {
        const newService = params?.additionalServices.find((additionalService) => additionalService.id === serviceId);
        if (newService) {
          return [...acc, newService];
        } else {
          return acc;
        }
      }, [])
    : [];

  return (
    <PageWrapper>
      {isVehicleLoading || isParamsLoading ? <Loader /> : null}
      <Container>
        <div className={classes.wrapper}>
          <div className={classes.card}>
            <CarCardMobile
              car={vehicle}
              startDate={booking?.pickupDate || null}
              endDate={booking?.returnDate || null}
              services={services}
              dropOffLocation={params?.dropOffLocations.find((location) => location.id === booking?.returnLocationId) || null}
              pickupLocation={params?.pickupLocations.find((location) => location.id === booking?.pickupLocationId) || null}
              processingFee={params?.fees.processingFee as number}
              duration={calculateDifferenceBetweenTwoDates(booking?.pickupDate as Date, booking?.returnDate as Date)}
            />
            <CarCardDesktop
              car={vehicle}
              startDate={booking?.pickupDate || null}
              endDate={booking?.returnDate || null}
              services={services}
              dropOffLocation={params?.dropOffLocations.find((location) => location.id === booking?.returnLocationId) || null}
              pickupLocation={params?.pickupLocations.find((location) => location.id === booking?.pickupLocationId) || null}
              processingFee={params?.fees.processingFee as number}
              duration={calculateDifferenceBetweenTwoDates(booking?.pickupDate as Date, booking?.returnDate as Date)}
            />
          </div>

          <div className={classes.information}>
            <Outlet />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
