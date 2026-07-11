/* eslint-disable @typescript-eslint/no-misused-promises */
import classes from '@components/Modal/ForgotPassword/index.module.scss';
import { Button, Input, Title } from '@components';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@services/schema';
import { ForgotPasswordContext } from '@components/Modal/ForgotPassword/ForgotPasswordContext.tsx';
import useResetPasswordMutation from '@components/Modal/ForgotPassword/useResetPassword.tsx';

type Props = {
  setCurrentStep: (currentStep: number) => void;
  cancelResetPassword: () => void;
};

const EmailStep: React.FC<Props> = ({ setCurrentStep, cancelResetPassword }) => {
  const { updateState } = useContext(ForgotPasswordContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ email: string }>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useResetPasswordMutation({
    onSuccess: () => {
      setCurrentStep(2);
    },
    onError: () => {
      setError('email', { type: 'custom', message: 'User with this email does not exist' });
    },
  });

  const onSubmit = handleSubmit(({ email }): void => {
    updateState({
      email,
    });
    mutate({ email });
  });

  return (
    <div className={classes.modal}>
      <Title className={classes.title}>Reset password</Title>
      <p className={classes.info}>Enter your email. We’ll send you a link to reset your password.</p>
      <form className={classes.form} onSubmit={onSubmit}>
        <Input
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : undefined}
          name="email"
          register={register}
          label="EMAIL"
          placeholder="Email"
          disabled={isPending}
        />
        <Button isDisabled={isPending} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
          Send code
        </Button>
        <Button
          className={classes.info_btn}
          isDisabled={isPending}
          textWeight="700"
          textUppercase={true}
          fullWidth={false}
          variant="text"
          textColor="primary"
          onClick={cancelResetPassword}
        >
          Back
        </Button>
      </form>
    </div>
  );
};

export default EmailStep;
