import { DetailsContentProps } from '@/pages/CarDetails';
import { ReactComponent as Fuel } from '@icons/fuel.svg';
import { ReactComponent as Doors } from '@icons/doors.svg';
import { ReactComponent as Seats } from '@icons/seats.svg';
import { ReactComponent as Age } from '@icons/age.svg';
import { ReactComponent as Deposit } from '@icons/deposit.svg';
import { ReactComponent as Cancelation } from '@icons/cancelation.svg';
import classes from './index.module.scss';
import { Container, Modal, ShowMore } from '@/components';
import { Carousel } from './Carousel';
import { useModal } from '@/components/Modal/useModal';
import { CancelationPolicy } from './CancelationPolicy';
import { formatCurrency } from '@/services/helpers';

export const DetailsContent = ({
  fuelType,
  description,
  galleryImages,
  features,
  additionalServices,
  doors,
  seats,
}: DetailsContentProps): JSX.Element => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  return (
    <Container>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <CancelationPolicy />
      </Modal>
      <section className={classes.wrapper}>
        <div className={classes.content}>
          <div className={classes.left}>
            <ul className={classes.specifications}>
              <li className={classes.specifications__item}>
                <Fuel />
                <span>{fuelType}</span>
              </li>
              <li className={classes.specifications__item}>
                <Doors />
                <span>
                  {doors} {Number(doors) !== 1 ? 'doors' : 'door'}
                </span>
              </li>
              <li className={classes.specifications__item}>
                <Seats />
                <span>
                  {seats} {Number(seats) !== 1 ? 'seats' : 'seat'}
                </span>
              </li>
            </ul>
            <div className={`${classes.divider} ${classes.divider__mobile}`}></div>
            <div className={classes.block}>
              <h2 className={classes.title}>DESCRIPTION</h2>
              <ShowMore>
                <p className={classes.text}>{description}</p>
              </ShowMore>
            </div>
            <div className={`${classes.divider} ${classes.divider__mobile}`}></div>
            <div className={classes.block}>
              <h2 className={classes.title}>FEATURES</h2>
              <ul className={classes.features}>
                {features.map((feature) => (
                  <li className={classes.features__item} key={feature.id}>
                    <img src={feature.iconUrl} alt="icon" width={30} height={30} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              <p className={classes.text}>Apple CarPlay is a registered trademark of Apple Inc. Android is a trademark of Google LLC.</p>
            </div>
            <div className={`${classes.divider} ${classes.divider__mobile}`}></div>
            <div className={classes.carousel}>
              <h2 className={classes.title}>GALLERY</h2>
              <Carousel cars={galleryImages} />
            </div>
            <div className={`${classes.divider} ${classes.divider__mobile}`}></div>
          </div>
          <div className={classes.right}>
            <div className={classes.requirements}>
              <h2 className={classes.title}>SUPER DELUXE CLASS</h2>
              <p className={classes.text}>This super exclusive car has a few additional requirements.</p>
              <div className={classes.requirements__item}>
                <Age />
                <div className={classes.requirements__block}>
                  <h3 className={classes.requirements__title}>Must be 25+ to book</h3>
                  <p className={classes.text}>You must be at least 25 years old to book this car.</p>
                </div>
              </div>
              <div className={classes.requirements__item}>
                <Deposit />
                <div className={classes.requirements__block}>
                  <h3 className={classes.requirements__title}>Deposit</h3>
                  <p className={classes.text}>
                    You’ll be charged a fully refundable deposit of $1000 when you book this car. It will be refunded after the trip ends without
                    incident.
                  </p>
                </div>
              </div>
            </div>
            <div className={classes.divider}></div>
            <div className={classes.services}>
              <h2 className={classes.title}>Additional Services</h2>
              <ul className={classes.services__list}>
                {additionalServices.map((service) => (
                  <li key={service.id}>
                    <span className={classes.services__name}>{service.name}</span>{' '}
                    <span className={classes.services__price}>
                      ({formatCurrency(Number(service.price))}
                      {service.code === 'prepaidFuel' ? null : '/day'})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={classes.divider}></div>
            <div className={classes.policy}>
              <h2 className={classes.title}>Cancellation policy</h2>
              <div className={classes.policy__item}>
                <Cancelation />
                <div className={classes.policy__block}>
                  <h3 className={classes.policy__title}>Free cancellation</h3>
                  <p className={classes.text}>If you cancel within 24h of booking</p>
                  <button onClick={openModal} className={classes.policy__button}>
                    Read Full Cancellation Policy
                  </button>
                </div>
              </div>
            </div>
            <div className={classes.divider}></div>
          </div>
        </div>
      </section>
    </Container>
  );
};
