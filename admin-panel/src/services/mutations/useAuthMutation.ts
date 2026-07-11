import { MutationFunction, UseMutateFunction, useMutation } from '@tanstack/react-query';
import { AuthCredentialsType, TokensType } from '../types/auth';
import { useState } from 'react';
import { useAuth } from '@/context/hooks/useAuth';
import { useAxios } from '@/api/useAxios';
import { CREDENTIALS_ERROR_TEXT } from '../constants';

type ReturnType = {
  credentialsError: string;
  authMutation: UseMutateFunction<TokensType, Error, AuthCredentialsType, unknown>;
  isAuthPending: boolean;
};

export default function useAuthMutation(): ReturnType {
  const [credentialsError, setCredentialsError] = useState('');
  const { login } = useAuth();
  const { api } = useAxios();

  async function fetchTokens(credentials: AuthCredentialsType): Promise<TokensType> {
    const { data }: { data: TokensType } = await api.post('/auth/admin/login', credentials);
    return data;
  }

  const { mutate: authMutation, isPending: isAuthPending } = useMutation({
    mutationFn: fetchTokens as unknown as MutationFunction<TokensType, AuthCredentialsType>,
    onSuccess: (data: TokensType) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      login();
      setCredentialsError('');
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
      setCredentialsError(CREDENTIALS_ERROR_TEXT);
    },
  });

  return { credentialsError, authMutation, isAuthPending };
}
