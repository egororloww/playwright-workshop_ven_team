import { useAxios } from '@/api/useAxios';
import { MutationFunction, UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';

type ReturnType = {
  handleChangeStatusMutation: UseMutateFunction<unknown, Error, unknown, unknown>;
  isStatusPending: boolean;
};
type PropsType = {
  bookingId: string;
  userId: number;
  handleAction?: () => void;
};

export const useStatusChange = ({ bookingId, handleAction, userId }: PropsType): ReturnType => {
  const { api } = useAxios();
  const queryClient = useQueryClient();

  async function handStatusChange(status: string): Promise<void> {
    await api.put(`/bookings/${bookingId}/status`, { status });
  }
  const { mutate: handleChangeStatusMutation, isPending: isStatusPending } = useMutation({
    mutationFn: handStatusChange as unknown as MutationFunction<ReturnType, unknown>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking', bookingId],
        refetchType: 'all',
      });
      await queryClient.invalidateQueries({
        queryKey: ['bookings', 'list'],
        refetchType: 'all',
      });
      await queryClient.invalidateQueries({
        queryKey: ['bookings', 'list', userId],
        refetchType: 'all',
      });
      handleAction && handleAction();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
  });
  return { handleChangeStatusMutation, isStatusPending };
};
