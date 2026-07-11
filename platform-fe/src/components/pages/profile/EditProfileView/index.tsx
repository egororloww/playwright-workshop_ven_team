/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { formatPhoneNumber } from '@/services/helpers';
import classes from '../index.module.scss';

import { useGetProfile } from '@/services/hooks/useGetProfile';
import { AccentButton, Button, CustomPhoneInput, Input, Loader } from '@/components';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { editProfileSchema } from '@/services/schema';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAxios } from '@/api/useAxios';
import { MutationFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ImageUpload from '../../driver-information/ImageUpload';
import { UpdateProfileDataType } from '@/services/types/auth';

export const EditProfileView = (): JSX.Element => {
  const {
    reset,
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editProfileSchema),
  });

  const { apiFormData } = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState<boolean>(false);

  const [isRemoveDriverLicenseImage1, setIsRemoveDriverLicenseImage1] = useState(false);
  const [isRemoveDriverLicenseImage2, setIsRemoveDriverLicenseImage2] = useState(false);
  const [isRemoveInsuranceCardImage, setIsRemoveInsuranceCardImage] = useState(false);
  const [isRemoveInsuranceDeclarationPageImage, setIsRemoveInsuranceDeclarationPageImage] = useState(false);

  const { data } = useGetProfile({
    queryKey: ['profile'],
    endpoint: '/users/profile/customer',
  });

  async function updateProfile(formData: UpdateProfileDataType): Promise<void> {
    await apiFormData.put('/users/profile', formData);
  }

  const handleNavigate = (): void => {
    navigate('/profile');
    setIsRemoveDriverLicenseImage1(false);
    setIsRemoveDriverLicenseImage2(false);
    setIsRemoveInsuranceCardImage(false);
    setIsRemoveInsuranceDeclarationPageImage(false);
    reset();
    setEmailError(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile as unknown as MutationFunction<void>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['profile'],
        exact: true,
        refetchType: 'active',
      });

      handleNavigate();

      await queryClient.invalidateQueries({
        queryKey: ['profile', 'booking'],
        refetchType: 'all',
      });
    },
    onError: (error: any) => {
      // eslint-disable-next-line no-console
      error?.response?.data?.fields.email ? setEmailError(true) : console.error(error);
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileDataType> = (profileData) => {
    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('phoneNumber', formatPhoneNumber(profileData.phoneNumber));
    formData.append('email', profileData.email);
    if (profileData.driverLicenseImage1) {
      formData.append('driverLicenseImage1', profileData.driverLicenseImage1[0]);
    }
    if (profileData.driverLicenseImage2) {
      formData.append('driverLicenseImage2', profileData.driverLicenseImage2[0]);
    }
    if (profileData.insuranceCardImage) {
      formData.append('insuranceCardImage', profileData.insuranceCardImage[0]);
    }
    if (profileData.insuranceDeclarationPageImage) {
      formData.append('insuranceDeclarationPageImage', profileData.insuranceDeclarationPageImage[0]);
    }
    if (!profileData.driverLicenseImage1 && !!data.driverLicenseImage1Url && isRemoveDriverLicenseImage1) {
      formData.append('isRemoveDriverLicenseImage1', 'true');
    }
    if (!profileData.driverLicenseImage2 && !!data.driverLicenseImage2Url && isRemoveDriverLicenseImage2) {
      formData.append('isRemoveDriverLicenseImage2', 'true');
    }
    if (!profileData.insuranceCardImage && !!data.insuranceCardImageUrl && isRemoveInsuranceCardImage) {
      formData.append('isRemoveInsuranceCardImage', 'true');
    }
    if (!profileData.insuranceDeclarationPageImage && !!data.insuranceDeclarationPageImageUrl && isRemoveInsuranceDeclarationPageImage) {
      formData.append('isRemoveInsuranceDeclarationPageImage', 'true');
    }

    mutate(formData);
  };

  useEffect(() => {
    if (data) {
      setValue('lastName', data.lastName || '');
      setValue('firstName', data.firstName || '');
      setValue('email', data.email || '');
      setValue('phoneNumber', data.phoneNumber.replace(/[^\d]/g, '') || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <form className={classes.profile} onSubmit={handleSubmit(onSubmit)}>
      {isPending ? <Loader /> : null}
      <div className={classes.information}>
        <div className={classes.information__row}>
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
        <div className={classes.information__row}>
          <Input
            placeholder="Your email"
            type="email"
            label="Email"
            register={register}
            name="email"
            disabled={isPending}
            onChange={() => setEmailError(false)}
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
      <div className={classes.documents}>
        <div className={classes.documents__block}>
          <h3 className={classes.documents__title}>ATTACH SCANS OF YOUR DRIVER LICENSE</h3>
          <p>File must be less than 10 MB and in JPG, JPEG, PNG or PDF format.</p>

          <div className={classes.documents__images}>
            <Controller
              name="driverLicenseImage1"
              control={control}
              render={({ field: { onChange } }) => (
                <ImageUpload
                  helperText={errors.driverLicenseImage1 && errors.driverLicenseImage1.message}
                  error={!!errors.driverLicenseImage1}
                  onChange={onChange}
                  name="driverLicenseImage1"
                  image={data.driverLicenseImage1Url}
                  isImageVisible={!isRemoveDriverLicenseImage1}
                  onImageRemove={() => setIsRemoveDriverLicenseImage1(!isRemoveDriverLicenseImage1)}
                  fileName={data.driverLicenseImage1OriginalKey}
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
                  image={data.driverLicenseImage2Url}
                  isImageVisible={!isRemoveDriverLicenseImage2}
                  onImageRemove={() => setIsRemoveDriverLicenseImage2(!isRemoveDriverLicenseImage2)}
                  fileName={data.driverLicenseImage2OriginalKey}
                />
              )}
            />
          </div>
        </div>
        <div className={classes.documents__block}>
          <h3 className={classes.documents__title}>Attach scans of your insurance</h3>
          <p>File must be less than 10 MB and in JPG, JPEG, PNG or PDF format.</p>
          <div className={classes.documents__images}>
            <div className={classes.imageWrapper}>
              <h4 className={classes.imageTitle}>Declaration page</h4>
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
                    image={data.insuranceDeclarationPageImageUrl}
                    isImageVisible={!isRemoveInsuranceDeclarationPageImage}
                    onImageRemove={() => setIsRemoveInsuranceDeclarationPageImage(!isRemoveInsuranceDeclarationPageImage)}
                    fileName={data.insuranceDeclarationPageImageOriginalKey}
                  />
                )}
              />
            </div>
            <div className={classes.imageWrapper}>
              <h4 className={classes.imageTitle}>Insurance card</h4>
              <Controller
                name="insuranceCardImage"
                control={control}
                render={({ field: { onChange } }) => (
                  <ImageUpload
                    helperText={errors.insuranceCardImage && errors.insuranceCardImage.message}
                    error={!!errors.insuranceCardImage}
                    onChange={onChange}
                    name="insuranceCardImage"
                    image={data.insuranceCardImageUrl}
                    isImageVisible={!isRemoveInsuranceCardImage}
                    onImageRemove={() => setIsRemoveInsuranceCardImage(!isRemoveInsuranceCardImage)}
                    fileName={data.insuranceCardImageOriginalKey}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.actions}>
        <AccentButton disabled={isPending} onClick={handleNavigate} textUppercase={true} textWeight="700">
          Cancel
        </AccentButton>
        <Button disabled={isPending} textUppercase={true} textWeight="700" fullWidth={false} type="submit">
          Save changes
        </Button>
      </div>
    </form>
  );
};
