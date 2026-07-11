/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { AvailabilityDatepicker, Button, TextField } from '@/components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactNode, useContext } from 'react';
import { availabilitySchema } from '@/services/schemas';
import { SetCarUnavailableHoursSchemaType, SetCarUnavailableHoursType } from '@/services/types/cars';

import { pickerDateESTToISOString } from '@/services/helpers/time';
import { useSetCarUnavailableHours } from '@/services/fetchers/useSetCarUnavailableHours';
import { useParams } from 'react-router-dom';
import classes from './index.module.scss';
import { CarAvailabilityContext } from '@pages/Car/CarAvailability/CarAvailabilityContext';
import { toast } from 'react-toastify';

type ComponentProps = {
  handleClose: () => void;
};

type DirtyFieldType = 'unavailableFrom' | 'unavailableTo' | 'comment';

export const CreateAvailabilityForm = ({ handleClose }: ComponentProps): ReactNode => {
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    trigger,
  } = useForm({
    resolver: yupResolver<SetCarUnavailableHoursSchemaType>(availabilitySchema),
  });

  const { reFetchSchedule } = useContext(CarAvailabilityContext);

  const dirtyFieldsArray: string[] = Object.keys(dirtyFields);

  const { id } = useParams();

  const handleReset = (): void => {
    reFetchSchedule();
    handleClose();
  };

  const { handleSetCarUnavailableHoursMutation, isStatusPending } = useSetCarUnavailableHours({
    handleAction: handleReset,
    carId: id as string,
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const onSubmit = (data: SetCarUnavailableHoursSchemaType): void => {
    const newData: SetCarUnavailableHoursType = {
      unavailableFrom: pickerDateESTToISOString(data.unavailableFrom),
      unavailableTo: pickerDateESTToISOString(data.unavailableTo),
      comment: data.comment,
      vehicleId: Number(id),
    };
    handleSetCarUnavailableHoursMutation(newData);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="unavailableFrom"
        render={({ field }) => (
          <AvailabilityDatepicker
            errorMessage={errors.unavailableFrom?.message}
            label="From"
            onChange={async (date) => {
              field.onChange(date);
              await trigger(dirtyFieldsArray as DirtyFieldType[]);
            }}
            selected={field.value}
            placeholderText="Date from"
            disabled={isStatusPending}
          />
        )}
      />
      <Controller
        control={control}
        name="unavailableTo"
        render={({ field }) => (
          <AvailabilityDatepicker
            errorMessage={errors.unavailableTo?.message}
            label="To"
            onChange={async (date) => {
              field.onChange(date);
              await trigger(dirtyFieldsArray as DirtyFieldType[]);
            }}
            selected={field.value}
            placeholderText="Date to"
            disabled={isStatusPending}
          />
        )}
      />
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextField
            placeholder="Comment"
            {...field}
            label="Comment"
            name="comment"
            error={errors?.comment?.message as string}
            disabled={isStatusPending}
          />
        )}
      />
      <div className={classes.form__actions}>
        <Button type="button" onClick={handleClose} fullWidth={false} textColor="accent" color="white" size="md" disabled={isStatusPending}>
          CANCEL
        </Button>
        <Button type="submit" fullWidth={false} size="md" disabled={isStatusPending}>
          SET UNAVAILABLE
        </Button>
      </div>
    </form>
  );
};
