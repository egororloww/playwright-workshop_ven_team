/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
// import { CarType } from './car';

export type ServiceType = {
  id: number;
  name: string;
  price: string;
  code?: string;
};

export type LocationType = {
  id: number;
  address: string;
  price: string;
};

export type VehicleParamsType = {
  pickupLocations: LocationType[];
  dropOffLocations: LocationType[];
  additionalServices: ServiceType[];
  fees: {
    processingFee: number;
  };
};

export type BookingType = {
  pickupLocationId?: number | string;
  returnLocationId?: number | string;
  vehicleId?: number | string;
  pickupDate?: Date | null | string;
  returnDate?: Date | null | string;
  additionalServices: Array<number>;
  amount?: string;
};

export interface BookingContextType {
  booking: BookingType | null;
  prebooking: RentalParams;

  setBooking: (arg: BookingType) => void;
  setPrebooking: (arg: RentalParams) => void;
  handleBookingReset: () => void;
  handlePrebooking: ({ key, data }: { key: string; data: unknown }) => void;
  calculateFee: (fee?: number, amount?: number) => number;
}

export type ProfileBookingViewDataType = {
  driverLicenseImage1?: any;
  driverLicenseImage2?: any;
  insuranceDeclarationPageImage?: any;
  insuranceCardImage?: any;
  isRemoveDriverLicenseImage1?: boolean;
  isRemoveDriverLicenseImage2?: boolean;
  isRemoveInsuranceDeclarationPageImage?: boolean;
  isRemoveInsuranceCardImage?: boolean;
};

export type RentalParams = {
  pickupLocationId?: string | number;
  returnLocationId?: string | number;
  vehicleId: string | number;
  pickupDate: string;
  returnDate: string;
  additionalServices?: number[];
  amount?: string;
  isSameLocation?: boolean;
};
