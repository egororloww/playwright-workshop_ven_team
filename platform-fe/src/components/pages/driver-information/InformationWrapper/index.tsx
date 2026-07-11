/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import classes from './index.module.scss';
import { Title } from '@/components';
import { RegistrationForm } from '../RegistrationForm';
import { Stepper } from '../Stepper';
import { useAuth } from '@/context/hooks/useAuth';
import { ProfileBookingView } from '../ProfileBookingView';
import { Navigate } from 'react-router-dom';

export const InformationWrapper = (): JSX.Element | null => {
  const { isAuthenticated } = useAuth();

  if (!sessionStorage.getItem('booking')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={classes.content}>
      <Stepper />
      <Title className={classes.title}>Driver Information</Title>

      {isAuthenticated ? <ProfileBookingView /> : <RegistrationForm />}
    </div>
  );
};
