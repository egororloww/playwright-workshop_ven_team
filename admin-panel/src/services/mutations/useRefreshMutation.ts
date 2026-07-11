import { MutationFunction, UseMutateFunction, useMutation } from '@tanstack/react-query';
import { TokensType } from '../types/auth';
import { useAuth } from '@/context/hooks/useAuth';
import { useAxios } from '@/api/useAxios';

type ReturnType = {
  refreshMutation: UseMutateFunction<TokensType, Error, unknown, unknown>;
  isRefreshPending: boolean;
};

export default function useRefreshMutation(): ReturnType {
  const { login, setIsRefreshPending } = useAuth();
  const { api } = useAxios();

  async function refreshUser(token: TokensType): Promise<TokensType> {
    const { data }: { data: TokensType } = await api.post('/auth/refresh', token);
    return data;
  }

  const { mutate: refreshMutation, isPending: isRefreshPending } = useMutation({
    mutationFn: refreshUser as unknown as MutationFunction<TokensType>,
    onSuccess: (data: TokensType) => {
      const { accessToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      login();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
    onSettled: () => setIsRefreshPending(false),
  });

  return { refreshMutation, isRefreshPending };
}
