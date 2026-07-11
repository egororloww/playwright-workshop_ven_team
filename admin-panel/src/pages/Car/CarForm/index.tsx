/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Button, ContentWrapper, Header, Loader, Typography } from '@components';
import classes from './index.module.scss';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as ChevronIcon } from '@icons/chevron-right.svg';
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg';
import { useForm } from 'react-hook-form';
import { AGE_LIMIT_OPTIONS, FUEL_TYPE_OPTIONS } from '@pages/Car/CarForm/contstants.ts';
import { Field, ImageUploadField, SelectField, TextAreaFiled } from '@/elements/FormFields';
import { yupResolver } from '@hookform/resolvers/yup';
import { carFormScheme } from '@services/schemas';
import { useContext, useEffect, useState } from 'react';
import { CarFormContext, CarFormProvider } from './CarFormContext';
import GalleryImages from '@pages/Car/CarForm/GalleryImages';
import { validateNumberField } from '@/services/helpers';
import useCarApi from '@pages/Car/CarForm/useCarApi.tsx';
import { createFromData } from '@pages/Car/CarForm/helpers.ts';
import { CarCreateFormType } from '@services/types/cars.ts';
import { toast } from 'react-toastify';

type CarFormProps = {
  isEdit?: boolean;
};

const formatPrice = (price: string | number): string => {
  const priceAbs = Math.abs(Number(price));
  const decimal = priceAbs - Math.floor(priceAbs);
  return price ? `$${priceAbs.toFixed(decimal > 0 ? 2 : 0)}` : '';
};

const CarForm: React.FC<CarFormProps> = () => {
  const { data, updateData, carFeaturesOptions, isLoading: isFetching, carId } = useContext(CarFormContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [step, setStep] = useState(hash ? 1 : 0);

  const isLoading = loading || isFetching;

  const { createCar, editCar } = useCarApi({ carId });

  const form = useForm({
    defaultValues: {
      make: data.make,
      model: data.model,
      price: formatPrice(data.price),
      doors: String(data.doors || ''),
      seats: String(data.seats || ''),
      fuelType: data.fuelType,
      ageLimit: data.ageLimit,
      description: data.description,
      features: data.features,
      normalImage: data.normalImage,
      hoverImage: data.hoverImage,
      mainImage: data.mainImage,
    },
    mode: 'onChange',
    resolver: yupResolver(carFormScheme),
  });
  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, dirtyFields },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    const valuesToSave = {
      ...values,
      price: Number(values.price.replace(/^\D+/g, '')),
    } as CarCreateFormType;

    if (!carId) {
      const formData = createFromData({ data: valuesToSave, dirtyFields: null });
      const newCar = await createCar(formData);
      toast.success('The car is successfully created and is displayed on the booking platform', {
        style: { fontSize: '0.75rem' },
        autoClose: 7000,
      });
      toast.warning('Add gallery images to finalize the car creation flow', {
        style: { fontSize: '0.75rem' },
        delay: 1000,
        autoClose: 7000,
      });
      window.history.pushState({}, '', `/cars/edit/${newCar.id}`);
      navigate(`/cars/edit/${newCar.id}#1`);
    } else {
      const formData = createFromData({ data: valuesToSave, dirtyFields });
      if (Array.from(formData.entries()).length) {
        await editCar(formData);
      }
      updateData({
        ...valuesToSave,
      });
      navigate('#1');
      setStep(1);
    }

    setLoading(false);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!validateNumberField(e.key)) {
      e.preventDefault();
    }
  };

  const handleKeyDownDecimal = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!validateNumberField(e.key, true)) {
      e.preventDefault();
    }
  };

  const handleBlur = (): void => {
    const price = getValues('price');
    setValue('price', formatPrice(price));
  };

  const handleFocus = (): void => {
    const price = getValues('price');
    const numberPrice = Number(price.replace(/^\D+/g, ''));
    setValue('price', numberPrice === 0 ? '' : String(numberPrice));
  };

  useEffect(() => {
    setStep(hash ? 1 : 0);
  }, [hash]);

  return (
    <ContentWrapper>
      <Header>
        <div className={classes.header}>
          <Typography className={classes.header__link} component={Link} to={'/cars'} color="dark-060" size="lg" textWeight="700">
            Cars
          </Typography>
          <ChevronIcon className={classes.header__icon} />
          <Typography className={classes.header__name} color="dark" size="lg" textWeight="700">
            {carId ? `${data.make} ${data.model}` : 'Add car'}
          </Typography>
        </div>
      </Header>
      <div className={classes.content_wrapper}>
        {isLoading && <Loader />}

        {!isLoading && step === 0 && (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <form className={classes.form} onSubmit={onSubmit}>
            <div className={classes.fields_mainRow}>
              <Field form={form} name="make" label="Make" placeholder="Make" />
              <Field form={form} name="model" label="Model" placeholder="Model" />
            </div>
            <div className={classes.fields_row}>
              <Field
                form={form}
                name="price"
                label="Price per day"
                placeholder="Price per day"
                onKeyDown={handleKeyDownDecimal}
                onBlur={handleBlur}
                onFocus={handleFocus}
              />
              <div className={classes.field}>
                <SelectField form={form} name="fuelType" options={FUEL_TYPE_OPTIONS} label="Fuel type" placeholder="Select" />
              </div>
              <Field form={form} name="doors" label="Doors" onKeyDown={handleKeyDown} placeholder="Doors" />
              <Field form={form} name="seats" label="Seats" onKeyDown={handleKeyDown} placeholder="Seats" />
              <div className={classes.field}>
                <SelectField form={form} name="ageLimit" options={AGE_LIMIT_OPTIONS} label="Age limit" placeholder="Select" />
              </div>
            </div>
            <TextAreaFiled form={form} placeholder="Description" name="description" label="Description" />
            <Typography className={classes.listing_images_title} color="dark-080" textAlign="left" textWeight="600" component="p">
              Listing images
            </Typography>
            <div className={classes.listing_images}>
              <div className={`${classes.listing_images_item} ${classes.field}`}>
                <ImageUploadField form={form} name="normalImage" label="Normal" />
              </div>
              <div className={`${classes.listing_images_item} ${classes.field}`}>
                <ImageUploadField form={form} name="hoverImage" label="Hover" />
              </div>
            </div>
            <div className={classes.image_tooltip}>Aspect ratio 1.46:1 • Minimum 224x153px • Up to 100KB • PNG</div>
            <Typography className={classes.listing_images_title} color="dark-080" textAlign="left" textWeight="600" component="p">
              Cover image
            </Typography>
            <div className={classes.listing_images}>
              <div className={`${classes.listing_images_item} ${classes.field}`}>
                <ImageUploadField form={form} name="mainImage" />
              </div>
            </div>
            <div className={classes.image_tooltip}>Aspect ratio 2.057:1 • Minimum 1440х700px • Up to 2MB • PNG or JPG or JPEG</div>
            <div className={classes.field}>
              <SelectField form={form} name="features" isMulti options={carFeaturesOptions} label="Features" placeholder="Select" />
            </div>
            <div className={classes.button_group}>
              <Button
                className={classes.button_cancel}
                type="button"
                fullWidth={false}
                variant="text"
                component={Link}
                to={carId ? `/cars/${carId}` : '/cars'}
              >
                CANCEL
              </Button>
              <Button
                className={classes.button_submit}
                disabled={!isValid}
                type="submit"
                fullWidth={false}
                IconRight={carId ? ArrowRight : undefined}
              >
                {carId ? 'NEXT' : 'PUBLISH'}
              </Button>
            </div>
          </form>
        )}
        {!isLoading && step === 1 && (
          <GalleryImages
            onBack={() => {
              navigate('');
              setStep(0);
            }}
          />
        )}
      </div>
    </ContentWrapper>
  );
};

const CarFormPage: React.FC = () => {
  const { id } = useParams();
  return (
    <CarFormProvider carId={id}>
      <CarForm isEdit={!!id} />
    </CarFormProvider>
  );
};

export default CarFormPage;
