/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, TextField } from '@/components';
import { Typography } from '@/components/common/Typography';
import useAuthMutation from '@/services/mutations/useAuthMutation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from '@/services/schemas';
import { AuthCredentialsType } from '@/services/types/auth';
import classes from './index.module.scss';

export const Login = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<AuthCredentialsType>(authSchema),
  });
  const { credentialsError, authMutation, isAuthPending } = useAuthMutation();

  const onSubmit = (data: AuthCredentialsType): void => {
    authMutation(data);
  };
  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography color="dark" size="xlg" textUppercase={true} textWeight="700" component="h2">
        Sign In
      </Typography>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            placeholder="Email"
            {...field}
            label="Email"
            name={'email'}
            type="email"
            error={(errors?.email?.message as string) || credentialsError}
            disabled={isAuthPending}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            placeholder="Password"
            {...field}
            label="Password"
            name={'password'}
            type="password"
            error={(errors?.password?.message as string) || credentialsError}
            disabled={isAuthPending}
          />
        )}
      />
      <Button disabled={isAuthPending} type="submit" textUppercase={true} textWeight="700">
        Sign In
      </Button>
    </form>
  );
};
