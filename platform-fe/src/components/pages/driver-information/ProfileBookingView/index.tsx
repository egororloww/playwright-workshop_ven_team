/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageUpload from '../ImageUpload';
import classes from './index.module.scss';
import { Button, Loader } from '@/components';
import { formatPhoneNumber } from '@/services/helpers';
import { useState } from 'react';
import { MutationFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '@/api/useAxios';
import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '@/services/hooks/useGetProfile';
import { documentsEditSchema } from '@/services/schema';
import { ProfileBookingViewDataType } from '@/services/types/booking';
import VerifyPhoneNumber from '@components/VerifyPhoneNumber';

export const ProfileBookingView = (): JSX.Element => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(documentsEditSchema),
  });

  const { apiFormData } = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isVerifyPhoneOpen, setIsVerifyPhoneOpen] = useState<boolean>(false);

  const [isRemoveDriverLicenseImage1, setIsRemoveDriverLicenseImage1] = useState(false);
  const [isRemoveDriverLicenseImage2, setIsRemoveDriverLicenseImage2] = useState(false);
  const [isRemoveInsuranceCardImage, setIsRemoveInsuranceCardImage] = useState(false);
  const [isRemoveInsuranceDeclarationPageImage, setIsRemoveInsuranceDeclarationPageImage] = useState(false);

  const { data } = useGetProfile({
    queryKey: ['profile', 'booking'],
    endpoint: '/users/profile/customer/booking',
  });

  async function updateImages(formData: ProfileBookingViewDataType): Promise<void> {
    await apiFormData.put('/users/profile/images', formData);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateImages as unknown as MutationFunction<void>,
    onSuccess: async () => {
      navigate('/booking/terms-and-conditions');
      setIsRemoveDriverLicenseImage1(false);
      setIsRemoveDriverLicenseImage2(false);
      setIsRemoveInsuranceCardImage(false);
      setIsRemoveInsuranceDeclarationPageImage(false);
      reset();

      await queryClient.invalidateQueries({
        queryKey: ['profile', 'booking'],
        exact: true,
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: ['profile'],
        exact: true,
        refetchType: 'active',
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
  });

  const onSubmit: SubmitHandler<ProfileBookingViewDataType> = (images) => {
    const formData = new FormData();
    if (images.driverLicenseImage1) {
      formData.append('driverLicenseImage1', images.driverLicenseImage1[0]);
    }
    if (images.driverLicenseImage2) {
      formData.append('driverLicenseImage2', images.driverLicenseImage2[0]);
    }
    if (images.insuranceCardImage) {
      formData.append('insuranceCardImage', images.insuranceCardImage[0]);
    }
    if (images.insuranceDeclarationPageImage) {
      formData.append('insuranceDeclarationPageImage', images.insuranceDeclarationPageImage[0]);
    }
    if (!images.driverLicenseImage1 && !!data.driverLicenseImage1Url && isRemoveDriverLicenseImage1) {
      formData.append('isRemoveDriverLicenseImage1', 'true');
    }
    if (!images.driverLicenseImage2 && !!data.driverLicenseImage2Url && isRemoveDriverLicenseImage2) {
      formData.append('isRemoveDriverLicenseImage2', 'true');
    }
    if (!images.insuranceCardImage && !!data.insuranceCardImageUrl && isRemoveInsuranceCardImage) {
      formData.append('isRemoveInsuranceCardImage', 'true');
    }
    if (!images.insuranceDeclarationPageImage && !!data.insuranceDeclarationPageImageUrl && isRemoveInsuranceDeclarationPageImage) {
      formData.append('isRemoveInsuranceDeclarationPageImage', 'true');
    }

    const formDataLength = Array.from(formData.entries()).length;

    formDataLength ? mutate(formData) : navigate('/booking/terms-and-conditions');
  };

  const handleContinue = handleSubmit((values): void => {
    if (!data.isPhoneNumberVerified) {
      setIsVerifyPhoneOpen(true);
      return;
    }
    onSubmit(values);
  });

  return (
    <div className={classes.profile}>
      {isPending ? <Loader /> : null}
      <div className={classes.information}>
        <div className={classes.information__block}>
          <h3 className={classes.information__title}>First name</h3>
          <p className={classes.information__text}>{data.firstName}</p>
        </div>
        <div className={classes.information__block}>
          <h3 className={classes.information__title}>Last name</h3>
          <p className={classes.information__text}>{data.lastName}</p>
        </div>
        <div className={classes.information__block}>
          <h3 className={classes.information__title}>Email</h3>
          <p className={classes.information__text}>{data.email}</p>
        </div>
        <div className={classes.information__block}>
          <h3 className={classes.information__title}>Phone number</h3>
          <p className={classes.information__text}>{formatPhoneNumber(data.phoneNumber)}</p>
        </div>
      </div>
      <form className={classes.form}>
        <div className={classes.form__container}>
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
                      image={data.insuranceDeclarationPageImageUrl}
                      isImageVisible={!isRemoveInsuranceDeclarationPageImage}
                      onImageRemove={() => setIsRemoveInsuranceDeclarationPageImage(!isRemoveInsuranceDeclarationPageImage)}
                      fileName={data.insuranceDeclarationPageImageOriginalKey}
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
                      image={data.insuranceCardImageUrl}
                      isImageVisible={!isRemoveInsuranceCardImage}
                      onImageRemove={() => setIsRemoveInsuranceCardImage(!isRemoveInsuranceCardImage)}
                      fileName={data.insuranceCardImageOriginalKey}
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
        <Button textWeight="700" textUppercase={true} fullWidth={true} type="button" onClick={handleContinue}>
          Continue
        </Button>
      </form>
      <VerifyPhoneNumber
        phoneNumber={data?.phoneNumber}
        isOpen={isVerifyPhoneOpen}
        closeModal={() => {
          setIsVerifyPhoneOpen(false);
        }}
        onSuccess={handleSubmit(onSubmit)}
      />
    </div>
  );
};
