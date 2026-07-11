/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAxios } from '@/api/useAxios';
import { MutationFunction, UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { SetCarUnavailableHoursType } from '../types/cars';

type ReturnType = {
  handleSetCarUnavailableHoursMutation: UseMutateFunction<unknown, Error, unknown, unknown>;
  isStatusPending: boolean;
};
type PropsType = {
  handleAction?: () => void;
  onError?: (error: { response: { data: { message: string } } }) => void;
  carId: number | string;
};

export const useSetCarUnavailableHours = ({ handleAction, carId, onError }: PropsType): ReturnType => {
  const { api } = useAxios();
  const queryClient = useQueryClient();

  async function handSetCarUnavailableHours(data: SetCarUnavailableHoursType): Promise<void> {
    await api.post(`/vehiclesUnavailableHours`, data);
  }
  const { mutate: handleSetCarUnavailableHoursMutation, isPending: isStatusPending } = useMutation({
    mutationFn: handSetCarUnavailableHours as unknown as MutationFunction<ReturnType, unknown>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['car availability', carId.toString()],
        refetchType: 'all',
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries({ queryKey: ['car availability schedule'] });

      handleAction && handleAction();
    },
    onError: (error: any) => {
      if (onError) onError(error as { response: { data: { message: string } } });
    },
  });

  return { handleSetCarUnavailableHoursMutation, isStatusPending };
};
