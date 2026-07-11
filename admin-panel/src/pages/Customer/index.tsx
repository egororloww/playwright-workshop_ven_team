import { ContentWrapper, Header, Tabs, Typography } from '@/components';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useCustomerInfo } from '@/services/fetchers/useCustomerInfo';
import { useCustomerBookingsList } from '@/services/fetchers/useCustomerBookingsList';
import { ReactComponent as ChevronIcon } from '@icons/chevron-right.svg';
import classes from './index.module.scss';

export const Customer = (): JSX.Element => {
  const { id } = useParams();
  const { customer } = useCustomerInfo(id as string);
  const { bookingsList } = useCustomerBookingsList(id as string);

  return (
    <ContentWrapper>
      <Header>
        <div className={classes.header}>
          <Typography className={classes.header__link} component={Link} to={'/customers'} color="dark-060" size="lg" textWeight="700">
            Customers
          </Typography>
          <ChevronIcon className={classes.header__icon} />
          <Typography className={classes.header__name} color="dark" size="lg" textWeight="700">
            {customer.firstName} {customer.lastName}
          </Typography>
        </div>
      </Header>
      <Tabs tab1={{ href: `/customers/${id}`, text: 'General' }} tab2={{ href: `bookings`, text: 'Bookings' }} />
      <Outlet context={{ customer, bookingsList }} />
    </ContentWrapper>
  );
};
