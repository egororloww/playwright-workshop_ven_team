import { ReactComponent as DotIcon } from '@icons/dot.svg';
import classes from './index.module.scss';
import { calculateDifferenceBetweenTwoDates, formatBookingCreatedDateMoment, formatBookingShortDateMoment, formatCurrency } from '@/services/helpers';
import { BookingType } from '../BookingsList';
import { AccentButton } from '@/components';
import { Link } from 'react-router-dom';
import { BookingStatus } from '@/components/BookingStatus';

export const BookingCard = ({ id, createdAt, pickupDate, returnDate, totalAmount, vehiclePrice, vehicle, status }: BookingType): JSX.Element => {
  const duration = calculateDifferenceBetweenTwoDates(pickupDate, returnDate);
  const formattedTotal = formatCurrency(Number(totalAmount));
  const formattedPickupDate = formatBookingShortDateMoment(pickupDate);
  const formattedReturnDate = formatBookingShortDateMoment(returnDate);
  const formattedCarPrice = formatCurrency(Number(vehiclePrice));
  const formattedCreationDate = formatBookingCreatedDateMoment(createdAt);

  return (
    <div className={classes.card}>
      <div className={classes.card__header}>
        <div className={classes.card__info}>
          <p className={`${classes.card__text} ${classes.card__text_normal}`}>#{id}</p>
          <DotIcon />
          <p className={`${classes.card__text} ${classes.card__text_normal} ${classes.creation}`}>{formattedCreationDate}</p>
          <DotIcon />
          <BookingStatus status={status} />
        </div>

        <AccentButton textUppercase={true} textWeight="700" component={Link} to={`/booking/${id}`}>
          View Details
        </AccentButton>
      </div>
      <div className={classes.card__content}>
        <div className={classes.car}>
          <div className={classes.car__image}>
            <img src={vehicle.normalImageUrl} alt="Car" width={80} height={54.701} />
          </div>
          <div className={classes.car__name}>
            <p className={`${classes.card__text} ${classes.card__text_bold}`}>
              {vehicle.make} {vehicle.model}
            </p>
            <p>
              <span className={`${classes.card__text} ${classes.card__text_bold}`}>{formattedCarPrice}</span>/day
            </p>
          </div>
        </div>
        <div className={classes.date}>
          <p>Pick-up & Return date</p>
          <p className={`${classes.card__text} ${classes.card__text_regular}`}>
            {formattedPickupDate} - {formattedReturnDate}
          </p>
        </div>
        <div className={classes.total}>
          <p>Total</p>
          <p>
            <span className={`${classes.card__text} ${classes.card__text_bold}`}>{formattedTotal}</span>/{duration} {duration === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>
    </div>
  );
};
