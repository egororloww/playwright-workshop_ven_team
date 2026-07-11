/* eslint-disable @typescript-eslint/no-misused-promises */
import classes from '@components/Modal/ForgotPassword/index.module.scss';
import { Button, Input, Title } from '@components';
import React, { useContext } from 'react';
import { ForgotPasswordContext } from '@components/Modal/ForgotPassword/ForgotPasswordContext.tsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordCodeSchema } from '@services/schema';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { useAxios } from '@api/useAxios.ts';
import useResetPasswordMutation from '@components/Modal/ForgotPassword/useResetPassword.tsx';
import useCountdown from '@services/helpers/useCountdown.tsx';

type Props = {
  setCurrentStep: (currentStep: number) => void;
};

type FormValues = {
  code: string;
};

const CodeStep: React.FC<Props> = ({ setCurrentStep }) => {
  const {
    state: { email },
    updateState,
  } = useContext(ForgotPasswordContext);
  const { secondsLeft, startTimer } = useCountdown({ seconds: 20 });
  const { mutate: resendCode, isPending: isResendingCode } = useResetPasswordMutation({
    onSuccess: startTimer,
  });

  const { api } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(forgotPasswordCodeSchema),
  });

  const sendCode = async ({ code }: FormValues): Promise<{ message: string }> => {
    const { data }: { data: { message: string } } = await api.post('/auth/resetPassword/code/verify', { code });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: sendCode as unknown as MutationFunction<{ message: string }>,
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: () => {
      setError('code', { type: 'custom', message: 'Incorrect verification code' });
    },
  });

  const onSubmit = handleSubmit(({ code }): void => {
    updateState({
      code,
    });
    mutate({ code });
  });

  const handleResend = (): void => {
    resendCode({ email });
  };

  const isDisabled = isResendingCode || isPending;

  return (
    <div className={classes.modal}>
      <Title className={classes.title}>Reset password</Title>
      <p className={classes.info}>Enter the code sent to {email}</p>
      <p className={classes.info}>
        Didn’t get an email?
        <Button
          className={classes.info_btn}
          textWeight="700"
          textUppercase={true}
          fullWidth={false}
          variant="string"
          textColor="primary"
          isDisabled={isDisabled || secondsLeft > 0}
          onClick={handleResend}
        >
          Resend code
        </Button>
        {secondsLeft ? ` in ${secondsLeft}s` : ''}
      </p>
      <form className={classes.form} onSubmit={onSubmit}>
        <Input
          error={!!errors.code}
          helperText={errors.code ? errors.code.message : undefined}
          name="code"
          register={register}
          label="CODE"
          placeholder="Code"
          disabled={isDisabled}
        />
        <Button isDisabled={isDisabled} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
          Enter code
        </Button>
        <Button
          className={classes.info_btn}
          isDisabled={isDisabled}
          textWeight="700"
          textUppercase={true}
          fullWidth={false}
          variant="text"
          textColor="primary"
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
      </form>
    </div>
  );
};

export default CodeStep;
