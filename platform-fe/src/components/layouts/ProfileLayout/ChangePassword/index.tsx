/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ReactNode, useState } from 'react';
import { Button, Input, Title } from '@/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { useAxios } from '@/api/useAxios';
import classes from './index.module.scss';
import { changePasswordSchema } from '@/services/schema';
import { ChangePasswordDataType } from '@/services/types/auth';

type Props = {
  closeModal: () => void;
};

export const ChangePassword = ({ closeModal }: Props): ReactNode => {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });
  const { api } = useAxios();
  const [passwordError, setPasswordError] = useState(false);

  async function updatePassword(credentials: ChangePasswordDataType): Promise<void> {
    await api.put('/users/password', credentials);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword as unknown as MutationFunction<void, ChangePasswordDataType>,
    onSuccess: () => {
      closeModal();
      reset();
      setPasswordError(false);
    },
    onError: (error: any) => {
      // eslint-disable-next-line no-console
      error?.response?.data?.fields.oldPassword ? setPasswordError(true) : console.error(error);
    },
  });
  const onSubmit: SubmitHandler<ChangePasswordDataType> = (data) => {
    const formData = { ...data };
    delete formData.confirmPassword;
    mutate(formData);
  };
  return (
    <div className={classes.modal}>
      <Title className={classes.title}>Change Password</Title>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          error={!!errors.oldPassword || passwordError}
          helperText={errors.oldPassword ? errors.oldPassword.message : passwordError ? 'Incorrect password' : undefined}
          name="oldPassword"
          register={register}
          label="Current password"
          placeholder="Current password"
          disabled={isPending}
          type="password"
          onChange={async (e: { target: { value: string } }) => {
            setPasswordError(false);
            setValue('oldPassword', e.target.value);
            await trigger();
          }}
        />
        <div className={classes.block}>
          <Input
            error={!!errors.newPassword}
            helperText={errors.newPassword && errors.newPassword.message}
            name="newPassword"
            register={register}
            label="New password"
            placeholder="New password"
            disabled={isPending}
            type="password"
            onChange={async (e: { target: { value: string } }) => {
              setValue('newPassword', e.target.value);
              await trigger();
            }}
          />
          <p className={classes.block__text}>
            Password should be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols.
          </p>
        </div>

        <Input
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && errors.confirmPassword.message}
          name="confirmPassword"
          register={register}
          label="Confirm new password"
          placeholder="Confirm new password"
          disabled={isPending}
          type="password"
          onChange={async (e: { target: { value: string } }) => {
            setValue('confirmPassword', e.target.value);
            await trigger();
          }}
        />
        <Button disabled={isPending} textUppercase={true} textWeight="700">
          Update password
        </Button>
      </form>
    </div>
  );
};
