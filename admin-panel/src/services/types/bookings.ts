import { CustomerInfoType } from './customers';

export type BookingType = {
  id: number;
  pickupDate: Date;
  returnDate: Date;
  totalAmount: string;
  createdAt: Date;
  status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled';
  vehicle: VehicleType;
  user: CustomerInfoType;
  pickupLocationAddress?: string;
  returnLocationAddress?: string;
  pickupLocationPrice?: string;
  returnLocationPrice?: string;
  processingFeeAmount?: string;
  vehiclePrice?: string;
  processingFee?: number;
  additionalServices?: ServiceType[];
};
export type VehicleType = {
  id: number;
  make: string;
  model: string;
};
export type ServiceType = {
  name: string;
  price: string;
};

export type StatusType = { status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled' };

export type BookingListType = BookingType[];
export type DataBookingListType = { bookings: BookingType[] };
