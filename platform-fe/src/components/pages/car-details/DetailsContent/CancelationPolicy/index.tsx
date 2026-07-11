import { Title } from '@/components';
import classes from './index.module.scss';

export const CancelationPolicy = (): JSX.Element => (
  <div className={classes.modal}>
    <Title className={classes.title}>Cancellation Policy</Title>
    <div className={classes.block}>
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
  </div>
);
