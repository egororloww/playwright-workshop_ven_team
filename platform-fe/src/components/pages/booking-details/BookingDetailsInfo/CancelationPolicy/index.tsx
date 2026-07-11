/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Title } from '@/components';
import classes from './index.module.scss';

type Props = {
  onClick: any;
  onClose: () => void;
  bookingId?: string;
  isDisabled: boolean;
};

export const CancelationPolicy = ({ onClick, onClose, bookingId, isDisabled }: Props): JSX.Element => (
  <div className={classes.modal}>
    <Title className={classes.title}>Cancel booking</Title>
    <div className={classes.block}>
      <p className={classes.caution}>Are you sure you want to cancel your booking #{bookingId}?</p>
      <p className={classes.block__title}>Cancelation policy</p>
      <h3 className={classes.block__title}>For bookings made at least 24 hours before the trip:</h3>
      <ul className={classes.block__list}>
        <li>Customer may cancel free of charge within 24 hours of booking. </li>
        <li>50% refund is issued when Customer gives at least 24 hours notice.</li>
        <li>75% refund is issued when Customer gives less than 24 hours notice.</li>
      </ul>
    </div>
    <div className={classes.block}>
      <h3 className={classes.block__title}>For bookings made less than 24 hours before the trip:</h3>
      <ul className={classes.block__list}>
        <li>Customer may cancel free of charge within 1 hour of booking. </li>
        <li>50% refund is issued when Customer gives at least 20 minutes notice. </li>
        <li>No refund is issued when Customer gives less than 20 minutes notice.</li>
      </ul>
    </div>
    <div className={classes.block}>
      <Button isDisabled={isDisabled} onClick={onClick} fullWidth={true} textUppercase={true} textWeight="700">
        Confirm
      </Button>
      <Button
        isDisabled={isDisabled}
        onClick={onClose}
        className={classes.cancel}
        fullWidth={true}
        textUppercase={true}
        textWeight="700"
        textGradient="accent"
      >
        Cancel
      </Button>
    </div>
  </div>
);
