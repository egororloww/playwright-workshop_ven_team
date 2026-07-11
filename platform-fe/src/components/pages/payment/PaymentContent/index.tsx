import { Stepper } from '../Stepper/index.tsx';
import { Title } from '@/components/index.ts';
import { PaymentForm } from '../PaymentForm/index.tsx';
import classes from './index.module.scss';

export const PaymentContent = (): JSX.Element => {
  return (
    <div className={classes.content}>
      <Stepper />
      <Title className={classes.title}>Payment</Title>
      <PaymentForm />
    </div>
  );
};
