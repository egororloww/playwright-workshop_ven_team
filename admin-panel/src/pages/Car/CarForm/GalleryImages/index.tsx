import { useContext, useEffect, useState } from 'react';
import { CarFormContext } from '@pages/Car/CarForm/CarFormContext.tsx';
import { Button, Loader, Typography } from '@components';
import { ReactComponent as ArrowLeft } from '@icons/arrow-left.svg';
import classes from './index.module.scss';
import { useFieldArray, useForm } from 'react-hook-form';
import { carGalleryImagesFormScheme } from '@services/schemas';
import ImageUpload from '@/elements/FormFields/ImageUpload';
import ImagePreview from '@pages/Car/CarForm/GalleryImages/ImagePreview.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import useCarApi from '@pages/Car/CarForm/useCarApi.tsx';

const GalleryImages: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, updateData, carId, galleryDeleteIds, updateGalleryDeleteIds } = useContext(CarFormContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { galleryAdd, galleriesDelete } = useCarApi({ carId });

  const form = useForm({
    defaultValues: {
      galleryImages: data.galleryImages || [],
    },
    mode: 'onChange',
    resolver: yupResolver(carGalleryImagesFormScheme),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'galleryImages',
    keyName: 'uiID',
  });

  const onSubmit = handleSubmit(async () => {
    setIsLoading(true);

    if (carId) {
      const addGalleryFormDataArray = fields
        .filter((img) => !img.id)
        .map((img) => {
          const addFormData = new FormData();
          addFormData.append('galleryImage', img.value);
          addFormData.append('vehicleId', carId);
          return addFormData;
        });

      if (galleryDeleteIds.length) {
        await galleriesDelete({ ids: galleryDeleteIds });
      }

      for (const addFormData of addGalleryFormDataArray) {
        await galleryAdd(addFormData);
      }

      navigate(`/cars/${carId}`);
    }
    setIsLoading(false);
  });

  const handleRemove = (field: { value: File | string; id?: number | string }, index: number): void => {
    if (field.id) {
      updateGalleryDeleteIds(field.id as number);
    }
    remove(index);
  };

  const handleBack = (): void => {
    const values = getValues();
    updateData(values);

    onBack();
  };

  useEffect(() => {
    if (data?.galleryImages?.length || data.mainImage) {
      // eslint-disable-next-line no-console
      trigger().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit}>
        <Typography className={classes.listing_images_title} color="dark-080" textAlign="left" textWeight="600" component="p">
          Gallery images
        </Typography>
        <div className={classes.listing_images}>
          <div className={classes.others_container}>
            <div className={classes.others_img_container}>
              {fields.map((image, index) => (
                <div key={image.id} className={`${classes.field}`}>
                  <ImagePreview
                    imgSrc={image.value}
                    onRemove={() => {
                      handleRemove(image, index);
                    }}
                    error={errors.galleryImages?.[index]?.message}
                  />
                </div>
              ))}
              <div className={classes.field}>
                <ImageUpload
                  asUpload
                  onChange={(files) => {
                    if (files) {
                      append({
                        value: files[0],
                      });
                      void trigger('galleryImages');
                    }
                  }}
                  name="name"
                />
              </div>
            </div>
            {errors.galleryImages?.message ? (
              <Typography className={classes.field_error} size="sm" color="accent" textAlign="left" component="p">
                {errors.galleryImages?.message}
              </Typography>
            ) : null}
          </div>
        </div>
        <div className={classes.image_tooltip}>Aspect ratio 2.057:1 • Minimum 1440х700px • Up to 2MB • PNG or JPG or JPEG</div>
        <div className={classes.button_group}>
          <Button
            className={classes.button_back}
            type="button"
            fullWidth={false}
            variant="text"
            IconLeft={ArrowLeft}
            disabled={isLoading}
            onClick={handleBack}
          >
            BACK
          </Button>
          <Button
            type="button"
            className={classes.button_cancel}
            disabled={isLoading}
            variant="text"
            component={Link}
            to={carId ? `/cars/${carId}` : '/cars'}
            fullWidth={false}
          >
            CANCEL
          </Button>
          <Button type="submit" fullWidth={false} disabled={!isValid || isLoading}>
            {carId ? 'SAVE' : 'SAVE'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default GalleryImages;
