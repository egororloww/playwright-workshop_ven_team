export type CustomerType = {
  id: number;
  email: string;
  firstName: string;
  phoneNumber: string;
  lastName: string;
  bookingsCount: number;
  totalRevenue: number;
};

export type CustomerListType = CustomerType[];
export type DataCustomerListType = { users: CustomerType[] };

export type CustomerInfoType = {
  id: number;
  email: string;
  firstName: string;
  phoneNumber: string;
  lastName: string;
  driverLicenseImage1Url: string;
  driverLicenseImage2Url: string;
  insuranceDeclarationPageImageUrl: string;
  insuranceCardImageUrl: string;
  isPhoneNumberVerified: boolean;
  driverLicenseImage1OriginalKey?: string;
  driverLicenseImage2OriginalKey?: string;
  insuranceCardImageOriginalKey?: string;
  insuranceDeclarationPageImageOriginalKey?: string;
};
