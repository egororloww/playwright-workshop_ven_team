import useLogoutMutation from '@/services/mutations/useLogoutMutation';
import { Button } from '../../Button';
import { Typography } from '../../Typography';
import classes from './index.module.scss';

type ComponentProps = {
  closeModal: () => void;
};

export const ModalContent = ({ closeModal }: ComponentProps): JSX.Element => {
  const { logoutMutation, isLogoutPending } = useLogoutMutation({ handleAction: closeModal });
  return (
    <div className={classes.modal}>
      <Typography component="h2" size="lg" textWeight="700" color="dark">
        Logout
      </Typography>
      <Typography component="p" size="md" textWeight="500" color="dark-080">
        Are you sure you want to log out?
      </Typography>
      <div className={classes.actions}>
        <Button disabled={isLogoutPending} onClick={closeModal} fullWidth={false} textColor="accent" color="white" size="md">
          Cancel
        </Button>
        <Button onClick={logoutMutation} disabled={isLogoutPending} fullWidth={false} size="md">
          Yes, Log out
        </Button>
      </div>
    </div>
  );
};
