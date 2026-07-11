import { Button, Typography } from '@/components';
import classes from './index.module.scss';
import { CarUnavailableHoursType } from '@/services/types/cars';
import { useDeleteUnavailableHours } from '@/services/fetchers/useDeleteUnavailableHours';
import { formatBookingCreatedAtDateMoment } from '@/services/helpers/time';

type ComponentProps = {
  closeModal: () => void;
  unavailableHours: CarUnavailableHoursType;
};

export const ModalContent = ({ closeModal, unavailableHours }: ComponentProps): JSX.Element => {
  const { handleDeleteUnavailableHoursMutation, isStatusPending } = useDeleteUnavailableHours({
    unavailableHoursId: unavailableHours.id,
    carId: unavailableHours.vehicleId,
    handleAction: closeModal,
  });
  return (
    <div className={classes.modal}>
      <Typography component="h2" size="lg" textWeight="700" color="dark">
        Delete unavailability
      </Typography>
      <Typography className={classes.body} component="p" size="md" textWeight="500" color="dark-080">
        Are you sure you want to delete unavailability from {formatBookingCreatedAtDateMoment(unavailableHours.unavailableFrom)} to{' '}
        {formatBookingCreatedAtDateMoment(unavailableHours.unavailableTo)} "{unavailableHours.comment}"?
      </Typography>
      <div className={classes.actions}>
        <Button disabled={isStatusPending} onClick={closeModal} fullWidth={false} textColor="accent" color="white" size="md">
          Cancel
        </Button>
        <Button onClick={handleDeleteUnavailableHoursMutation} disabled={isStatusPending} fullWidth={false} size="md">
          Yes, Delete
        </Button>
      </div>
    </div>
  );
};
