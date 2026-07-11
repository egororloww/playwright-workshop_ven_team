import { useAxios } from '@/api/useAxios';
import { MutationFunction, UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { CarAvailabilityContext } from '@pages/Car/CarAvailability/CarAvailabilityContext';

type ReturnType = {
  handleDeleteUnavailableHoursMutation: UseMutateFunction<unknown, Error, unknown, unknown>;
  isStatusPending: boolean;
};
type PropsType = {
  unavailableHoursId: number;
  carId: number;
  handleAction?: () => void;
};

export const useDeleteUnavailableHours = ({ unavailableHoursId, handleAction, carId }: PropsType): ReturnType => {
  const { api } = useAxios();
  const queryClient = useQueryClient();
  const { reFetchSchedule } = useContext(CarAvailabilityContext);

  async function handDeleteUnavailableHours(): Promise<void> {
    await api.delete(`/vehiclesUnavailableHours/${unavailableHoursId}`);
  }
  const { mutate: handleDeleteUnavailableHoursMutation, isPending: isStatusPending } = useMutation({
    mutationFn: handDeleteUnavailableHours as unknown as MutationFunction<ReturnType, unknown>,
    onSuccess: async () => {
      reFetchSchedule();
      await queryClient.invalidateQueries({
        queryKey: ['car availability', carId.toString()],
        refetchType: 'all',
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries({ queryKey: ['car availability schedule'] });
      handleAction && handleAction();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
  });
  return { handleDeleteUnavailableHoursMutation, isStatusPending };
};
