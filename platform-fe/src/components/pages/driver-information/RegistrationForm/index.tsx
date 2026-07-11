/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/context/hooks/useAuth';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { RegistrationDataType, TokensType } from '@/services/types/auth';
import { Button, CustomPhoneInput, Input } from '@/components';
import { usePopup } from '@/context/hooks/usePopup';
import ImageUpload from '../ImageUpload';
import classes from './index.module.scss';
import { useEffect, useState } from 'react';
import { formatPhoneNumber } from '@/services/helpers';
import { useAxios } from '@/api/useAxios';
import { registrationSchema } from '@/services/schema';

export const RegistrationForm = (): JSX.Element => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const { login } = useAuth();
  const { openPopup: openAuthPopup } = usePopup();
  const { apiFormData } = useAxios();

  const [emailError, setEmailError] = useState<boolean>(false);

  async function registerUser(formData: RegistrationDataType): Promise<TokensType> {
    const { data }: { data: TokensType } = await apiFormData.post('/auth/register', formData);
    return data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser as unknown as MutationFunction<TokensType>,
    onSuccess: (data: TokensType) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      login();
      setEmailError(false);
    },
    onError: (error: any) => {
      // eslint-disable-next-line no-console
      error?.response?.data?.fields.email ? setEmailError(true) : console.error(error);
    },
  });
  const onSubmit: SubmitHandler<RegistrationDataType> = (data) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('phoneNumber', formatPhoneNumber(data.phoneNumber));
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.driverLicenseImage1) {
      formData.append('driverLicenseImage1', data.driverLicenseImage1[0]);
    }
    if (data.driverLicenseImage2) {
      formData.append('driverLicenseImage2', data.driverLicenseImage2[0]);
    }
    if (data.insuranceCardImage) {
      formData.append('insuranceCardImage', data.insuranceCardImage[0]);
    }
    if (data.insuranceDeclarationPageImage) {
      formData.append('insuranceDeclarationPageImage', data.insuranceDeclarationPageImage[0]);
    }

    mutate(formData);
  };

  useEffect(() => {
    const registrationJSON = sessionStorage.getItem('registration');

    if (registrationJSON) {
      const registrationFields = JSON.parse(registrationJSON) as RegistrationDataType;

      setValue('lastName', registrationFields.lastName || '');
      setValue('firstName', registrationFields.firstName || '');
      setValue('email', registrationFields.email || '');
      setValue('phoneNumber', registrationFields.phoneNumber || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      const fields = { ...value };
      delete fields.password;
      delete fields.confirmPassword;
      delete fields.driverLicenseImage1;
      delete fields.driverLicenseImage2;
      delete fields.insuranceCardImage;
      delete fields.insuranceDeclarationPageImage;
      sessionStorage.setItem('registration', JSON.stringify(fields));
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  return (
    <div className={classes.wrapper}>
      <p className={classes.account}>
        Already have an account? <button onClick={openAuthPopup}>Sign IN</button>
      </p>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.form__container}>
          <div className={classes.form__block}>
            <div className={classes.form__row}>
              <Input
                error={!!errors.firstName}
                helperText={errors.firstName && errors.firstName.message}
                name="firstName"
                register={register}
                label="first name"
                placeholder="Your first name"
                disabled={isPending}
              />
              <Input
                error={!!errors.lastName}
                helperText={errors.lastName && errors.lastName.message}
                name="lastName"
                register={register}
                label="last name"
                placeholder="Your last name"
                disabled={isPending}
              />
            </div>
            <div className={classes.form__row}>
              <Input
                onChange={() => setEmailError(false)}
                placeholder="Your email"
                type="email"
                label="Email"
                register={register}
                name="email"
                disabled={isPending}
                error={!!errors.email || emailError}
                helperText={errors.email ? errors.email.message : emailError ? 'Email address already in use' : undefined}
              />
              <CustomPhoneInput
                control={control}
                helperText={errors.phoneNumber && errors.phoneNumber.message}
                error={!!errors.phoneNumber}
                disabled={isPending}
              />
            </div>
          </div>
          <div className={classes.form__block}>
            <div className={classes.form__row}>
              <Input
                error={!!errors.password}
                helperText={errors.password && errors.password.message}
                name="password"
                register={register}
                label="Password"
                placeholder="Create password"
                disabled={isPending}
                type="password"
                onChange={async (e: { target: { value: string } }) => {
                  setValue('password', e.target.value);
                  await trigger(['password', 'confirmPassword']);
                }}
              />
              <Input
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword && errors.confirmPassword.message}
                name="confirmPassword"
                register={register}
                label="Confirm password"
                placeholder="Create password"
                disabled={isPending}
                type="password"
                onChange={async (e: { target: { value: string } }) => {
                  setValue('confirmPassword', e.target.value);
                  await trigger(['password', 'confirmPassword']);
                }}
              />
            </div>
          </div>
          <div className={classes.files}>
            <h3 className={classes.files__title}>Attach scans of your driver license</h3>
            <p className={classes.files__restrictions}>File must be less than 10 MB and in JPG, JPEG, PNG or PDF format.</p>
            <div className={classes.files__row}>
              <Controller
                name="driverLicenseImage1"
                control={control}
                render={({ field: { onChange } }) => (
                  <ImageUpload
                    helperText={errors.driverLicenseImage1 && errors.driverLicenseImage1.message}
                    error={!!errors.driverLicenseImage1}
                    onChange={onChange}
                    name="driverLicenseImage1"
                  />
                )}
              />
              <Controller
                name="driverLicenseImage2"
                control={control}
                render={({ field: { onChange } }) => (
                  <ImageUpload
                    helperText={errors.driverLicenseImage2 && errors.driverLicenseImage2.message}
                    error={!!errors.driverLicenseImage2}
                    onChange={onChange}
                    name="driverLicenseImage2"
                  />
                )}
              />
            </div>
            <p className={classes.files__contacts}>
              You may also email a copy of your driver’s license to <a href="mailto:info@elitefleetgroup.com">info@elitefleetgroup.com</a>
            </p>
          </div>
          <div className={classes.files}>
            <h3 className={classes.files__title}>Attach scans of your insurance</h3>
            <p className={classes.files__restrictions}>File must be less than 10 MB and in JPG, JPEG, PNG or PDF format.</p>
            <div className={classes.files__row}>
              <div className={classes.file}>
                <h4 className={classes.file__title}>Declaration page</h4>
                <Controller
                  name="insuranceDeclarationPageImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <ImageUpload
                      helperText={errors.insuranceDeclarationPageImage && errors.insuranceDeclarationPageImage.message}
                      error={!!errors.insuranceDeclarationPageImage}
                      onChange={onChange}
                      name="insuranceDeclarationPageImage"
                      size="page"
                    />
                  )}
                />
              </div>
              <div className={classes.file}>
                <h4 className={classes.file__title}>Insurance card</h4>
                <Controller
                  name="insuranceCardImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <ImageUpload
                      helperText={errors.insuranceCardImage && errors.insuranceCardImage.message}
                      error={!!errors.insuranceCardImage}
                      onChange={onChange}
                      name="insuranceCardImage"
                    />
                  )}
                />
              </div>
            </div>
            <p className={classes.files__contacts}>
              You may also email a copy of your insurance declaration page and insurance card to{' '}
              <a href="mailto:info@elitefleetgroup.com">info@elitefleetgroup.com</a>
            </p>
          </div>
        </div>

        <Button isDisabled={isPending} textWeight="700" textUppercase={true} fullWidth={true} type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
};
