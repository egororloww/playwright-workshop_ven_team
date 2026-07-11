/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAxios } from '@/api/useAxios';
import { MutationFunction, UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type ReturnType = {
  generateWinner: UseMutateFunction<unknown, Error, unknown, unknown>;
  isWinnerGenerating: boolean;
  isWinnerGeneratingError: boolean;
  error: boolean;
};

export const useGenerateRaffleWinner = (): ReturnType => {
  const [error, setError] = useState(false);
  const { api } = useAxios();
  const queryClient = useQueryClient();

  async function generateUser(): Promise<any> {
    await api.post('/raffles/winners/generate');
  }

  const {
    mutate: generateWinner,
    isPending: isWinnerGenerating,
    isError: isWinnerGeneratingError,
  } = useMutation({
    mutationFn: generateUser as unknown as MutationFunction<unknown>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['raffle', 'list'],
        refetchType: 'all',
        exact: true,
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
      setError(true);
    },
  });

  useEffect(() => {
    if (error) {
      const timeout: number | undefined = setTimeout(() => {
        setError(false);
        clearTimeout(timeout);
      }, 5000);
    }
  }, [error]);

  return { generateWinner, isWinnerGenerating, isWinnerGeneratingError, error };
};
