import { MutationFunction, UseMutateFunction, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/hooks/useAuth';
import { useAxios } from '@/api/useAxios';

type ReturnType = {
  logoutMutation: UseMutateFunction<unknown, Error, unknown, unknown>;
  isLogoutPending: boolean;
};
type PropsType = {
  handleAction?: () => void;
};

export default function useLogoutMutation({ handleAction }: PropsType): ReturnType {
  const { logout } = useAuth();
  const { api } = useAxios();

  async function handleLogout(): Promise<void> {
    await api.post('/auth/logout');
  }

  const { mutate: logoutMutation, isPending: isLogoutPending } = useMutation({
    mutationFn: handleLogout as unknown as MutationFunction<ReturnType, unknown>,
    onSuccess: () => {
      logout();
      handleAction && handleAction();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
  });

  return { logoutMutation, isLogoutPending };
}
