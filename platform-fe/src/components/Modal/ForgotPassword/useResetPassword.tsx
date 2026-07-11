import { MutationFunction, useMutation } from '@tanstack/react-query';
import { useAxios } from '@api/useAxios.ts';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

const useResetPasswordMutation = ({ onSuccess, onError }: Props = {}) => {
  const { api } = useAxios();
  const resetPassword = async (body: { email: string }): Promise<{ message: string }> => {
    const { data }: { data: { message: string } } = await api.post('/auth/resetPassword', body);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword as unknown as MutationFunction<{ message: string }>,
    ...(onSuccess ? { onSuccess } : {}),
    ...(onError ? { onError } : {}),
  });

  return { mutate, isPending };
};

export default useResetPasswordMutation;
