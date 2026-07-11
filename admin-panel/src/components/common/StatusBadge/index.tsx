import classes from './index.module.scss';

type Props = {
  status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled';
  fullWidth?: boolean;
};

export const StatusBadge = ({ status, fullWidth }: Props): JSX.Element => {
  return <div className={`${classes.badge} ${classes['badge__' + status]} ${fullWidth ? classes['badge__fullWidth'] : ''}`}>{status}</div>;
};
