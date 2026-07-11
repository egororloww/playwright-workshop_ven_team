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

export type ChangePasswordDataType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
};
