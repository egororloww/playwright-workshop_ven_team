/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classes from './index.module.scss';
import { Button, Input, Title } from '@/components';
import { useAuth } from '@/context/hooks/useAuth';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { AuthCredentialsType, LoginFormInputsType, TokensType } from '@/services/types/auth';
import { usePopup } from '@/context/hooks/usePopup';
import { useAxios } from '@/api/useAxios';
import { authSchema } from '@/services/schema';
import ForgotPassword from '@components/Modal/ForgotPassword';

export const AuthPopupContent: React.FC = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputsType>({
    resolver: yupResolver(authSchema),
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [credentialsError, setCredentialsError] = useState(false);

  const { login } = useAuth();
  const { closePopup } = usePopup();
  const { api } = useAxios();

  async function fetchUser(credentials: AuthCredentialsType): Promise<TokensType> {
    const { data }: { data: TokensType } = await api.post('/auth/login', credentials);
    return data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: fetchUser as unknown as MutationFunction<TokensType, AuthCredentialsType>,
    onSuccess: (data: TokensType) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      login();
      closePopup();
      reset();
      setCredentialsError(false);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
      setCredentialsError(true);
    },
  });

  const onSubmit = (data: LoginFormInputsType): void => {
    mutate(data);
  };

  if (isForgotPassword) {
    return <ForgotPassword goBack={() => setIsForgotPassword(false)} />;
  }

  return (
    <div className={classes.modal}>
      <Title className={classes.title}>SIGN IN</Title>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          error={!!errors.email || credentialsError}
          helperText={errors.email ? errors.email.message : credentialsError ? 'Incorrect email or password' : undefined}
          name="email"
          register={register}
          label="EMAIL"
          placeholder="Email"
          disabled={isPending}
        />
        <Input
          error={!!errors.password || credentialsError}
          helperText={errors.password ? errors.password.message : credentialsError ? 'Incorrect email or password' : undefined}
          name="password"
          type="password"
          register={register}
          label="PASSWORD"
          placeholder="Password"
          autoComplete="new-password"
          disabled={isPending}
        />

        <Button disabled={isPending} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
          Sign in
        </Button>
      </form>
      <p className={classes.text}>
        Forgot your password?{' '}
        <button className={classes.button} onClick={() => setIsForgotPassword(true)}>
          Click Here
        </button>{' '}
      </p>
    </div>
  );
};
