import { useOutletContext } from 'react-router-dom';
import { UnavailableTime } from './UnavailableTime';
import classes from './index.module.scss';
import { Schedule } from './Schedule';
import CartAvailabilityProvider from '@pages/Car/CarAvailability/CarAvailabilityContext';

export const CarAvailability = (): JSX.Element => {
  const { id }: { id: string } = useOutletContext();

  return (
    <CartAvailabilityProvider id={id}>
      <div className={classes.wrapper}>
        <Schedule />
        <UnavailableTime id={id} />
      </div>
    </CartAvailabilityProvider>
  );
};
