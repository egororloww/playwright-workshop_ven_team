/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useNavigate } from 'react-router-dom';
import classes from './index.module.scss';
import { CarType } from '@/services/types/car';
import { useDrawer } from '@/context/hooks/useDrawer';
import { formatCurrency } from '@/services/helpers';
import { useBooking } from '@/context/hooks/useBooking';

type Props = {
  car: CarType;
};

type ArrowProps = {
  id: number;
};

export const CarCard = ({ car }: Props): JSX.Element => {
  const { hoverImageUrl, id, make, model, normalImageUrl, price } = car;
  const { handlePrebooking } = useBooking();
  const { openDrawer } = useDrawer();
  let navigate = useNavigate();

  const navigateToCarDetails = () => {
    const timeout = setTimeout(() => {
      navigate(`/our-cars/${id}`);
      clearTimeout(timeout);
    });
  };

  return (
    <button onClick={navigateToCarDetails} type="button" className={classes.card}>
      <div className={classes.card__image}>
        <img src={normalImageUrl} alt="Car Image" width={224} height={153} />
        <img src={hoverImageUrl} alt="Car Image" width={224} height={153} />
      </div>

      <h3 className={classes.card__title}>{`${make} ${model}`.trim()}</h3>
      <div className={classes.card__footer}>
        <p className={classes.card__price}>
          <span>{formatCurrency(Number(price))}</span>
          /day
        </p>
        <div
          onClick={(event) => {
            event.preventDefault();
            navigate = () => false;
            handlePrebooking({
              key: 'vehicleId',
              data: id,
            });
            openDrawer();
          }}
          aria-label="Open modal"
          className={classes.card__button}
        >
          <span>Book Now</span>
          <Arrow id={id} />
        </div>
      </div>
    </button>
  );
};

const Arrow = ({ id }: ArrowProps): JSX.Element => {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="arrow-right">
        <path
          id="Icon"
          d="M4.39734 10.5H16.064M16.064 10.5L10.2307 4.66666M16.064 10.5L10.2307 16.3333"
          stroke={`url(#paint0_linear_1574_3958_${id})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <linearGradient id={`paint0_linear_1574_3958_${id}`} x1="10.2307" y1="4.66666" x2="10.2307" y2="16.3333" gradientUnits="userSpaceOnUse">
          <stop className="main-stop" stopColor="#FFB800" />
          <stop className="alt-stop" offset="1" stopColor="#E97000" />
        </linearGradient>
      </defs>
    </svg>
  );
};
