import { ContentWrapper, Header, Tabs, Typography } from '@/components';
import { Link, Outlet, useParams } from 'react-router-dom';
import { ReactComponent as ChevronIcon } from '@icons/chevron-right.svg';
import { useCarDetails } from '@/services/fetchers/useCarsDetails';
import classes from './index.module.scss';
import ActionsMenu from '@pages/Car/CarDetails/ActionsMenu/';

export const Car = (): JSX.Element => {
  const { id } = useParams();
  const { carDetails } = useCarDetails(id as string);

  const carName = `${carDetails.make} ${carDetails.model}`;

  return (
    <ContentWrapper>
      <Header>
        <div className={classes.header}>
          <Typography className={classes.header__link} component={Link} to={'/cars'} color="dark-060" size="lg" textWeight="700">
            Cars
          </Typography>
          <ChevronIcon className={classes.header__icon} />
          <Typography className={classes.header__name} color="dark" size="lg" textWeight="700">
            {carName}
          </Typography>
          {!!id && <ActionsMenu carId={id} carName={carName} />}
        </div>
      </Header>
      <Tabs tab1={{ href: `/cars/${id}`, text: 'General' }} tab2={{ href: `availability`, text: 'Availability' }} />
      <Outlet context={{ carDetails, id }} />
    </ContentWrapper>
  );
};
