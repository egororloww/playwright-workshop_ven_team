import { Title } from '@/components';
import { Stepper } from '../Stepper';
import classes from './index.module.scss';
import { Terms } from '../Terms';

export const BookingTermsContent = (): JSX.Element => (
  <div className={classes.content}>
    <Stepper />
    <Title className={classes.title}>Terms and Conditions</Title>
    <Terms />
  </div>
);
