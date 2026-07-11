import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';

type Props = {
  endpoint: string;
  queryKey: string[];
};

type ProfileType = {
  email: 'string';
  firstName: 'string';
  lastName: 'string';
  phoneNumber: 'string';
  driverLicenseImage1Url: 'string';
  driverLicenseImage2Url: 'string';
  insuranceCardImageUrl: 'string';
  insuranceDeclarationPageImageUrl: 'string';
  isPhoneNumberVerified: boolean;
  driverLicenseImage1OriginalKey?: string;
  driverLicenseImage2OriginalKey?: string;
  insuranceCardImageOriginalKey?: string;
  insuranceDeclarationPageImageOriginalKey?: string;
};

type UserData = {
  data: { users: ProfileType };
};

export const useGetProfile = ({ endpoint, queryKey }: Props): UseSuspenseQueryResult<ProfileType, Error> => {
  const { api } = useAxios();

  async function fetchProfile(): Promise<ProfileType> {
    const {
      data: { users },
    }: UserData = await api.get(endpoint);
    return users;
  }
  return useSuspenseQuery({ queryKey, queryFn: fetchProfile, staleTime: Infinity });
};
