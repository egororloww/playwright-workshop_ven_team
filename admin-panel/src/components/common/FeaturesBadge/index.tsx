import { Typography } from '../Typography';
import classes from './index.module.scss';

type ComponentProps = {
  feature: string;
};

export const FeaturesBadge = ({ feature }: ComponentProps): JSX.Element => {
  return (
    <div className={classes.feature}>
      <Typography size="md" textWeight="500" textAlign="center" color="dark-080">
        {feature}
      </Typography>
    </div>
  );
};
