import { useAxios } from '@/api/useAxios';
import { DetailsContent, DetailsHero } from '@/components';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export interface DetailsHeroProps {
  firstResizedMainImageUrl: string;
  secondResizedMainImageUrl: string;
  thirdResizedMainImageUrl: string;
  fourthResizedMainImageUrl: string;
  make: string;
  model: string;
  price: string;
  id: number;
}
export interface DetailsContentProps {
  doors: number;
  seats: number;
  ageLimit: string;
  fuelType: string;
  description: string;
  galleryImages: GalleryImage[];
  features: Features[];
  additionalServices: AdditionalServices[];
}

export type GalleryImage = {
  id: number;
  vehicleId: number;
  imageUrl: string;
  imageKey: string;
  firstResizedImageKey: string;
  firstResizedImageUrl: string;
  secondResizedImageKey: string;
  secondResizedImageUrl: string;
  thirdResizedImageKey: string;
  thirdResizedImageUrl: string;
};
export type Features = {
  id: number;
  name: string;
  iconUrl: string | undefined;
  iconKey: string | undefined;
};
export type AdditionalServices = {
  id: number;
  name: string;
  price: string;
  code?: string;
};

interface DataType extends DetailsHeroProps, DetailsContentProps {
  id: number;
}

type Vehicles = {
  vehicles: DataType;
};

export const CarDetails = (): JSX.Element => {
  const { id } = useParams();
  const { api } = useAxios();

  async function fetchCar(): Promise<DataType> {
    const {
      data: { vehicles },
    }: { data: Vehicles } = await api.get(`/vehicles/${id}/platform`);
    return vehicles;
  }
  const { data }: UseSuspenseQueryResult<DataType, Error> = useSuspenseQuery({
    queryKey: ['car', id],
    queryFn: fetchCar,
    staleTime: Infinity,
  });
  const {
    firstResizedMainImageUrl,
    secondResizedMainImageUrl,
    thirdResizedMainImageUrl,
    fourthResizedMainImageUrl,
    make,
    model,
    price,
    seats,
    ageLimit,
    fuelType,
    description,
    galleryImages,
    features,
    additionalServices,
    doors,
    id: carId,
  } = data;

  return (
    <>
      <DetailsHero
        firstResizedMainImageUrl={firstResizedMainImageUrl}
        secondResizedMainImageUrl={secondResizedMainImageUrl}
        thirdResizedMainImageUrl={thirdResizedMainImageUrl}
        fourthResizedMainImageUrl={fourthResizedMainImageUrl}
        make={make}
        model={model}
        price={price}
        id={carId}
      />
      <DetailsContent
        seats={seats}
        ageLimit={ageLimit}
        fuelType={fuelType}
        description={description}
        galleryImages={galleryImages}
        features={features}
        additionalServices={additionalServices}
        doors={doors}
      />
    </>
  );
};
