import { UnavailableReasonEnum } from '../enums';

export type CarType = {
  id: number;
  make: string;
  model: string;
  price: string;
  seats: number;
  doors: number;
  fuelType: string;
  normalImageUrl: string;
  normalImageKey: string;
};

export type FeaturesType = {
  id: number;
  name: string;
  iconUrl: string;
  iconKey: string;
};

export type AdditionalServicesType = {
  id: number;
  name: string;
  price: string;
};

export type GalleryImagesType = {
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

export interface CarDetailsType extends CarType {
  ageLimit: string;
  description: string;
  mainImageUrl: string;
  mainImageKey: string;
  normalImageUrl: string;
  normalImageKey: string;
  hoverImageUrl: string;
  hoverImageKey: string;
  firstResizedMainImageKey: string;
  firstResizedMainImageUrl: string;
  secondResizedMainImageKey: string;
  secondResizedMainImageUrl: string;
  thirdResizedMainImageKey: string;
  thirdResizedMainImageUrl: string;
  fourthResizedMainImageKey: string;
  fourthResizedMainImageUrl: string;
  galleryImages: GalleryImagesType[];
  features: FeaturesType[];
  additionalServices: AdditionalServicesType[];
}

export type CarUnavailableHoursType = {
  id: number;
  vehicleId: number;
  comment: string;
  unavailableFrom: Date;
  unavailableTo: Date;
};

export type SetCarUnavailableHoursSchemaType = {
  comment: string;
  unavailableFrom: Date;
  unavailableTo: Date;
};
export type SetCarUnavailableHoursType = {
  comment: string;
  unavailableFrom: string;
  unavailableTo: string;
  vehicleId: number;
};
export type CarAvailabilityScheduleType = {
  id: number;
  type: UnavailableReasonEnum;
  dateFrom: string;
  dateTo: string;
  comment?: string;
};
export type CarAvailabilitySearchParamsType = {
  dateFrom: string;
  dateTo: string;
};

export type CarListType = CarType[];

export type DataCarListType = { vehicles: CarType[] };

export type CarFeature = {
  id: number;
  name: string;
  iconUrl: string;
  iconKey: string;
};

export type CreateCarResponse = {
  id: number;
  make: string;
  model: string;
  price: number;
  normalImageKey: string;
  normalImageUrl: string;
  hoverImageKey: string;
  hoverImageUrl: string;
};

export type CarCreateFormType = {
  make: string;
  model: string;
  price: string | number;
  seats: string | number;
  doors: string | number;
  fuelType: string;
  ageLimit: string;
  description: string;
  galleryImages: { value: File | string; id?: number | string }[];
  mainImage: FileList | string;
  hoverImage: FileList;
  normalImage: FileList;
  features: { label: string; value: string }[];
};
