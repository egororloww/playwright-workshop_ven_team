import { Button, Typography } from '@/components';
import { useStatusChange } from '@/services/fetchers/useStatusChange';
import classes from './index.module.scss';

type ComponentProps = {
  closeModal: () => void;
  bookingId: string;
  userId: number;
};

export const ModalContent = ({ closeModal, bookingId, userId }: ComponentProps): JSX.Element => {
  const { handleChangeStatusMutation, isStatusPending } = useStatusChange({ bookingId, userId, handleAction: closeModal });
  return (
    <div className={classes.modal}>
      <Typography component="h2" size="lg" textWeight="700" color="dark">
        Decline booking
      </Typography>
      <Typography component="p" size="md" textWeight="500" color="dark-080">
        Are you sure you want to decline booking {bookingId}?
      </Typography>
      <div className={classes.actions}>
        <Button disabled={isStatusPending} onClick={closeModal} fullWidth={false} textColor="accent" color="white" size="md">
          Cancel
        </Button>
        <Button onClick={() => handleChangeStatusMutation('declined')} disabled={isStatusPending} fullWidth={false} size="md">
          Yes, Decline
        </Button>
      </div>
    </div>
  );
};
