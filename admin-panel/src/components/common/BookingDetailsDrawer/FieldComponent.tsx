import classes from './index.module.scss';
import { Typography } from '@components';

type Props = {
  label: string;
  children?: React.ReactNode;
  className?: string;
};

const FieldComponent: React.FC<Props> = ({ label, children }) => {
  return (
    <div className={classes.input_field}>
      <Typography size="sm" textWeight="600" color="dark-040" component="h3">
        {label}
      </Typography>
      <Typography size="md" textWeight="500">
        {children}
      </Typography>
    </div>
  );
};

export default FieldComponent;
