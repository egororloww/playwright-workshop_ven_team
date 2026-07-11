/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react';
import { User } from './user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isRefreshPending: boolean;
  setIsRefreshPending: Dispatch<SetStateAction<boolean>>;
}

export type TokensType = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthCredentialsType = {
  email: string;
  password: string;
};

export type RegistrationDataType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  driverLicenseImage1?: any;
  driverLicenseImage2?: any;
  insuranceDeclarationPageImage?: any;
  insuranceCardImage?: any;
};

export type UpdateProfileDataType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  driverLicenseImage1?: any;
  driverLicenseImage2?: any;
  insuranceDeclarationPageImage?: any;
  insuranceCardImage?: any;
};

export type ChangePasswordDataType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type LoginFormInputsType = {
  email: string;
  password: string;
};
