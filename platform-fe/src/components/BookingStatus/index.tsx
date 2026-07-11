import { ReactNode } from 'react';
import classes from './index.module.scss';

type BookingStatusType = {
  status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled';
};

export const BookingStatus = ({ status }: BookingStatusType): ReactNode => {
  return <div className={`${classes.status} ${classes['status__' + status.toLowerCase()]}`}>{status}</div>;
};
