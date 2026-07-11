import { CarType } from '@/services/types/car';
import { LocationType, ServiceType } from '@/services/types/booking';
import { formatCurrency, formatDate } from '@/services/helpers';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import { ReactComponent as Chevron } from '@icons/chevron-down.svg';

import classes from './index.module.scss';

type Props = {
  car: CarType;
  startDate: Date | null | string;
  endDate: Date | null | string;
  services: ServiceType[];
  dropOffLocation: LocationType | null;
  pickupLocation: LocationType | null;
  duration: number;
  processingFee: number;
};

export const CarCardDesktop = ({
  car,
  startDate,
  endDate,
  services,
  dropOffLocation,
  pickupLocation,
  duration,
  processingFee,
}: Props): JSX.Element => {
  const { hoverImageUrl, make, model, normalImageUrl, price } = car;

  const carPrice = Number(price) * duration;
  const pickupLocationPrice = Number(pickupLocation?.price) || 0;
  const dropOffLocationPrice = Number(dropOffLocation?.price) || 0;

  const servicesPrice = services.reduce(
    (acc, service) => acc + Number(service?.code === 'prepaidFuel' ? +service?.price : +service?.price * duration),
    0
  );

  const subTotal = [carPrice, pickupLocationPrice, dropOffLocationPrice, servicesPrice].reduce((acc, price) => acc + price, 0);

  const fee = (subTotal * processingFee) / 100;
  const total = subTotal + fee;

  return (
    <div className={classes.card}>
      <div className={classes.card__image}>
        <img src={normalImageUrl} alt="Car Image" width={224} height={153} />
        <img src={hoverImageUrl} alt="Car Image" width={224} height={153} />
      </div>
      <div className={classes.card__info}>
        <h3 className={classes.card__title}>{`${make} ${model}`.trim()}</h3>
        {startDate ? (
          <div className={classes.book}>
            <p className={classes.book__title}>Pick-up date</p>
            <p className={classes.book__time}>{formatDate(startDate as Date)}</p>
            <p className={classes.book__location}>{pickupLocation?.address}</p>
          </div>
        ) : null}
        {endDate ? (
          <div className={classes.book}>
            <p className={classes.book__title}>Return date</p>
            <p className={classes.book__time}>{formatDate(endDate as Date)}</p>
            <p className={classes.book__location}>{dropOffLocation?.address}</p>
          </div>
        ) : null}
        <div className={classes.accordion}>
          <Accordion transition transitionTimeout={250}>
            <AccordionItem
              header={
                <div className={classes.header}>
                  <div className={classes.header__content}>
                    <p className={classes.header__title}>Total</p>
                    <p className={classes.header__title}>
                      {formatCurrency(total)}
                      <span>
                        /{duration} {duration === 1 ? 'day' : 'days'}
                      </span>
                    </p>
                  </div>
                  <span className={classes.header__arrow}>
                    <Chevron />
                  </span>
                </div>
              }
            >
              <div className={classes.content}>
                <div className={classes.content__row}>
                  <div className={classes.name}>
                    Car rental <span>({formatCurrency(Number(price))}/day)</span>
                  </div>
                  <div className={classes.price}>{formatCurrency(Number(price) * duration)}</div>
                </div>
                {pickupLocation ? (
                  <div className={classes.content__row}>
                    <div className={classes.name}>Pick-up</div>
                    <div className={classes.price}>{Number(pickupLocation?.price) ? formatCurrency(Number(pickupLocation.price)) : 'FREE'}</div>
                  </div>
                ) : null}
                {dropOffLocation ? (
                  <div className={classes.content__row}>
                    <div className={classes.name}>Return</div>
                    <div className={classes.price}>{Number(dropOffLocation.price) ? formatCurrency(Number(dropOffLocation.price)) : 'FREE'}</div>
                  </div>
                ) : null}
                {services && services.length ? (
                  <>
                    {services.map((service) => (
                      <div className={classes.content__row}>
                        <div className={classes.name}>
                          {service.name}{' '}
                          <span>
                            ({formatCurrency(Number(service.price))}
                            {service.code === 'prepaidFuel' ? null : '/day'})
                          </span>
                        </div>
                        <div className={classes.price}>
                          {formatCurrency(Number(service.code === 'prepaidFuel' ? service.price : +service.price * duration))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
                <div className={classes.content__row}>
                  <div className={classes.name}>
                    Processing Fee <span>({processingFee}%)</span>
                  </div>
                  <div className={classes.price}>{Number(fee) ? formatCurrency(Number(fee)) : 0}</div>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
