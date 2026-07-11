import classes from './index.module.scss';
type Props = { notificationIsOpen: boolean; message: string };

export const Notification = ({ notificationIsOpen, message }: Props): JSX.Element | null => {
  return notificationIsOpen ? <div className={classes.notification}>{message}</div> : null;
};
