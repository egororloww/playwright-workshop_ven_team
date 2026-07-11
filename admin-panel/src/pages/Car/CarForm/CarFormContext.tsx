/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useAxios } from '@api/useAxios.ts';
import { CarCreateFormType, CarDetailsType, CarFeature } from '@services/types/cars.ts';
import { debounce } from 'lodash';

type ContextType = {
  data: CarCreateFormType;
  updateData: (data: any) => void;
  carFeaturesOptions: { label: string; value: number }[];
  isLoading: boolean;
  carId?: string;
  galleryDeleteIds: number[];
  updateGalleryDeleteIds: (id: number) => void;
};

export const CarFormContext = createContext<ContextType>({} as ContextType);

export const CarFormProvider: React.FC<PropsWithChildren & { carId?: string }> = ({ children, carId }) => {
  const [data, setData] = useState({});
  const [galleryDeleteIds, setGalleryDeleteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [carFeaturesOptions, setCarFeaturesOptions] = useState<{ label: string; value: number }[]>([]);
  const { api } = useAxios();

  async function fetchCarFeatures(): Promise<CarFeature[]> {
    const {
      data: { vehicles: vehiclesFeatures },
    }: { data: { vehicles: CarFeature[] } } = await api.get(`/vehiclesFeatures/admin`);
    return vehiclesFeatures;
  }

  async function fetchCarDetails({ carId }: { carId: string }): Promise<CarDetailsType> {
    const {
      data: { vehicles },
    }: { data: { vehicles: CarDetailsType } } = await api.get(`/vehicles/${carId}/admin`);
    return vehicles;
  }

  const getCarFeatures = async (): Promise<void> => {
    const response = await fetchCarFeatures();
    setCarFeaturesOptions(response.map((feature) => ({ label: feature.name, value: feature.id })));
  };

  const getCarDetails = async ({ carId }: { carId: string }): Promise<void> => {
    setIsLoading(true);
    const vehicles = await fetchCarDetails({ carId });

    updateData({
      id: vehicles.id,
      make: vehicles.make,
      ageLimit: vehicles.ageLimit,
      model: vehicles.model,
      description: vehicles.description,
      price: vehicles.price,
      seats: vehicles.seats,
      doors: vehicles.doors,
      fuelType: vehicles.fuelType,
      galleryImages: vehicles.galleryImages.map((image) => ({ value: image.imageUrl, id: image.id })),
      mainImage: vehicles.mainImageUrl,
      hoverImage: vehicles.hoverImageUrl,
      normalImage: vehicles.normalImageUrl,
      features: vehicles.features.map((feature) => ({ label: feature.name, value: feature.id })),
    });
    setIsLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchCarFeatures = useCallback(debounce(getCarFeatures, 200), []);

  useEffect(() => {
    void debouncedFetchCarFeatures();
  }, []);

  useEffect(() => {
    if (!carId) return;
    // eslint-disable-next-line no-console
    getCarDetails({ carId }).catch(console.error);
  }, [carId]);

  const updateData = (values: any): void => {
    setData((prevState) => ({ ...prevState, ...values }));
  };

  const updateGalleryDeleteIds = (id: number): void => {
    setGalleryDeleteIds((prevState) => [...prevState, id] as number[]);
  };

  return (
    <CarFormContext.Provider
      value={{
        data: data as CarCreateFormType,
        updateData,
        carFeaturesOptions,
        isLoading,
        carId,
        galleryDeleteIds,
        updateGalleryDeleteIds,
      }}
    >
      {!isLoading ? children : null}
    </CarFormContext.Provider>
  );
};
