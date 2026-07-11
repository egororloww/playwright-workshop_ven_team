/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Input, Modal, Title } from '@components';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useCountdown from '@services/helpers/useCountdown.tsx';
import classes from './index.module.scss';
import { verifyPhoneSchema } from '@services/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAxios } from '@api/useAxios.ts';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { formatPhoneNumber } from '@/services/helpers';

type Props = {
  phoneNumber: string;
  isOpen: boolean;
  closeModal: () => void;
  onSuccess: () => void;
};

const ALLOWED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter'];

const VerifyPhoneNumber: React.FC<Props> = ({ phoneNumber = '', isOpen, closeModal, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ code: string }>({
    resolver: yupResolver(verifyPhoneSchema),
  });
  const { api } = useAxios();
  const { secondsLeft, startTimer, stopTimer } = useCountdown({ seconds: 20, autoStart: false });

  const verifyPhoneRequest = async (): Promise<{ message: string }> => {
    const { data }: { data: { message: string } } = await api.post('/users/send/phone/verification');
    return data;
  };
  const sendCodeRequest = async ({ code }: { code: string }): Promise<{ message: string }> => {
    const { data }: { data: { message: string } } = await api.post('/users/check/phone/verification', { code });
    return data;
  };
  const { mutate: verifyPhone, isPending: isPendingVerifyPhone } = useMutation({
    mutationFn: verifyPhoneRequest as unknown as MutationFunction<{ message: string }>,
    onSuccess: startTimer,
    onError: (error) => {
      startTimer();
      console.error(error);
    },
  });
  const { mutate: sendCode, isPending: isPendingCode } = useMutation({
    mutationFn: sendCodeRequest as unknown as MutationFunction<{ message: string }>,
    onSuccess,
    onError: (error) => {
      setError('code', { type: 'custom', message: 'Incorrect verification code' });
      console.error(error);
    },
  });

  const isDisabled = isPendingVerifyPhone || isPendingCode;

  const handleResend = (): void => {
    verifyPhone({ phoneNumber });
  };

  const onSubmit = handleSubmit(({ code }) => {
    sendCode({ code });
  });

  useEffect(() => {
    if (isOpen) {
      verifyPhone({ phoneNumber });
    } else {
      stopTimer();
    }
  }, [isOpen, phoneNumber]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!ALLOWED_KEYS.includes(e.key) && !e.key.match(/[0-9]/g)) {
      e.preventDefault();
    }
  };

  return (
    <Modal modalIsOpen={isOpen} closeModal={closeModal}>
      <div className={classes.modal}>
        <Title className={classes.title}>Verify your phone number</Title>
        <p className={classes.info}>Enter the verification code we sent to {formatPhoneNumber(phoneNumber)}</p>
        <p className={classes.info}>
          Didn’t get an SMS?
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
            helperText={errors?.code?.message}
            className={classes.code_field}
            type="number"
            name="code"
            register={register}
            label="Code"
            placeholder="Code"
            isDisabled={isDisabled}
            onKeyDown={handleKeyDown}
          />
          <Button isDisabled={isDisabled} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
            Verify
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default VerifyPhoneNumber;
