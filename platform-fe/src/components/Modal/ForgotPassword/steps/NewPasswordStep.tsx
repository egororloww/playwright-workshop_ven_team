/* eslint-disable @typescript-eslint/no-misused-promises */

import { Button, Input, Title } from '@components';
import classes from '@components/Modal/ForgotPassword/index.module.scss';
import React, { useContext } from 'react';
import { forgotPasswordNewPasswordSchema } from '@services/schema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAxios } from '@api/useAxios.ts';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { TokensType } from '@/services/types/auth';
import { useAuth } from '@context/hooks/useAuth.ts';
import { usePopup } from '@context/hooks/usePopup.ts';
import { ForgotPasswordContext } from '@components/Modal/ForgotPassword/ForgotPasswordContext.tsx';

type Props = {
  setCurrentStep: (currentStep: number) => void;
};

type FormValues = {
  password: string;
  confirmPassword: string;
};

const NewPasswordStep: React.FC<Props> = () => {
  const {
    state: { code },
  } = useContext(ForgotPasswordContext);
  const { login } = useAuth();
  const { closePopup } = usePopup();
  const { api } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(forgotPasswordNewPasswordSchema),
  });

  const sendCode = async (body: { password: string; code: string }): Promise<{ message: string }> => {
    const { data }: { data: { message: string } } = await api.post('/auth/resetPassword/confirm', body);
    return data;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: sendCode as unknown as MutationFunction<TokensType>,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      login();
      closePopup();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      setError('password', { type: 'custom', message: 'New password must be different from current password' });
      console.error({ error });
    },
  });

  const onSubmit = handleSubmit(({ password }): void => {
    mutate({ password, code });
  });

  return (
    <div className={classes.modal}>
      <Title className={classes.title}>Reset password</Title>
      <form className={classes.form} onSubmit={onSubmit}>
        <div>
          <Input
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            name="password"
            register={register}
            label="New Password *"
            placeholder="New password"
            disabled={isPending}
            type="password"
            onChange={async (e: { target: { value: string } }) => {
              setValue('password', e.target.value);
              await trigger(['password', 'confirmPassword']);
            }}
          />
          <p className={classes.password_rules}>
            Password should be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols.
          </p>
        </div>
        <Input
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && errors.confirmPassword.message}
          name="confirmPassword"
          register={register}
          label="Confirm new password *"
          placeholder="Confirm new password"
          disabled={isPending}
          type="password"
          onChange={async (e: { target: { value: string } }) => {
            setValue('confirmPassword', e.target.value);
            await trigger(['password', 'confirmPassword']);
          }}
        />
        <Button isDisabled={isPending} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordStep;
