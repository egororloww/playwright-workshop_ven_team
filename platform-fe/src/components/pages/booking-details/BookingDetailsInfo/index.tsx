import { useAxios } from '@/api/useAxios';
import classes from './index.module.scss';
import { ReactNode } from 'react';
import { MutationFunction, UseSuspenseQueryResult, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/context/hooks/useAuth';
import { AccentButton, Loader, Modal } from '@/components';
import { ReactComponent as DotIcon } from '@icons/dot.svg';
import { ReactComponent as CancelIcon } from '@icons/cancel.svg';
import { ReactComponent as MapIcon } from '@icons/map.svg';
import { ReactComponent as ArrowLeftIcon } from '@icons/arrow-left.svg';
import { BookingStatus } from '@/components/BookingStatus';
import { formatCurrency, calculateDifferenceBetweenTwoDates, formatBookingDateMoment, formatBookingCreatedDateMoment } from '@/services/helpers';
import { useModal } from '@/components/Modal/useModal';
import { CancelationPolicy } from './CancelationPolicy';

type ServiceType = {
  name: string;
  price: string;
  code?: string;
};

type VehicleType = {
  id: number;
  make: string;
  model: string;
  normalImageUrl: string;
  normalImageKey: string;
};

export type BookingInfoType = {
  id: number;
  status: 'new' | 'completed' | 'declined' | 'accepted' | 'canceled';
  pickupDate: Date;
  returnDate: Date;
  pickupLocationAddress: string;
  pickupLocationPrice: string;
  returnLocationAddress: string;
  returnLocationPrice: string;
  totalAmount: string;
  vehiclePrice: string;
  vehicleBookingPeriodAmount: string;
  processingFee: number;
  processingFeeAmount: string;
  additionalServices: ServiceType[];
  createdAt: Date;
  vehicle: VehicleType;
  user?: { id: number };
};

export type DataBookingDataType = { bookings: BookingInfoType };

export const BookingDetailsInfo = (): ReactNode => {
  const { id: bookingId } = useParams();
  const { api } = useAxios();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { modalIsOpen, openModal, closeModal } = useModal();

  async function fetchBookingsList(): Promise<BookingInfoType> {
    const {
      data: { bookings },
    }: { data: DataBookingDataType } = await api.get(`/bookings/${bookingId}/platform`);
    return bookings;
  }

  const { data }: UseSuspenseQueryResult<BookingInfoType, Error> = useSuspenseQuery({
    queryKey: ['bookings', bookingId],
    queryFn: fetchBookingsList,
    staleTime: Infinity,
  });

  async function cancelBooking(): Promise<void> {
    await api.put(`/bookings/${bookingId}/cancel`);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: cancelBooking as unknown as MutationFunction<void>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookings', 'list'],
        refetchType: 'all',
      });
      await queryClient.invalidateQueries({
        queryKey: ['bookings', bookingId],
        refetchType: 'all',
      });
      closeModal();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const {
    id,
    status,
    pickupDate,
    returnDate,
    pickupLocationAddress,
    pickupLocationPrice,
    returnLocationAddress,
    returnLocationPrice,
    totalAmount,
    vehiclePrice,
    processingFee,
    processingFeeAmount,
    additionalServices,
    createdAt,
    vehicle,
    user: currentBookingUser,
  } = data;

  const { make, model, normalImageUrl, id: vehicleId } = vehicle;

  const duration = calculateDifferenceBetweenTwoDates(pickupDate, returnDate);
  const formattedTotal = formatCurrency(Number(totalAmount));
  const formattedPickupDate = formatBookingDateMoment(pickupDate);
  const formattedReturnDate = formatBookingDateMoment(returnDate);
  const formattedCreationDate = formatBookingCreatedDateMoment(createdAt);
  const formattedCarPrice = formatCurrency(Number(vehiclePrice));
  const formattedProcessingFeeAmount = formatCurrency(Number(processingFeeAmount));

  return (
    <>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <CancelationPolicy onClick={mutate} onClose={closeModal} bookingId={bookingId} isDisabled={isPending} />
      </Modal>

      <div className={classes.body}>
        {isPending ? <Loader /> : null}
        {isAuthenticated ? (
          <AccentButton startIcon={<ArrowLeftIcon />} textWeight="700" component={Link} to="/booking/list">
            Back to all My Bookings
          </AccentButton>
        ) : null}
        <div className={classes.card}>
          <div className={classes.header}>
            <div className={classes.header__info}>
              <p className={`${classes.card__text} ${classes.card__text_normal}`}>#{id}</p>
              <DotIcon />
              <p className={`${classes.card__text} ${classes.card__text_normal} ${classes.creation}`}>{formattedCreationDate}</p>
              <DotIcon />
              <BookingStatus status={status} />
            </div>

            {isAuthenticated &&
            user?.id === currentBookingUser?.id &&
            status !== 'canceled' &&
            status !== 'completed' &&
            status !== 'declined' &&
            new Date().getTime() < new Date(pickupDate).getTime() ? (
              <button onClick={openModal} className={classes.cancel}>
                <CancelIcon />
                <span>Cancel</span>
              </button>
            ) : null}
          </div>
          <div className={classes.info}>
            <div className={classes.car}>
              <div className={classes.car__image}>
                <img src={normalImageUrl} alt="Car" width={80} height={54.701} />
              </div>
              <div className={classes.car__info}>
                <p className={`${classes.card__text} ${classes.card__text_bold}`}>
                  {make} {model}
                </p>
                <p>
                  <span className={`${classes.card__text} ${classes.card__text_bold}`}>{formattedCarPrice}</span>/day
                </p>
                <AccentButton component={Link} to={`/our-cars/${vehicleId}`} textWeight="500">
                  Car Info
                </AccentButton>
              </div>
            </div>
            <div className={classes.summary}>
              <div className={classes.summary__section}>
                <div className={classes.summary__row}>
                  <div className={classes.summary__block}>
                    <p>Pick-up date</p>
                    <p className={`${classes.card__text} ${classes.card__text_regular}`}>{formattedPickupDate}</p>
                  </div>
                </div>
                <div className={classes.summary__row}>
                  <div className={classes.summary__block}>
                    <p>Pick-up location</p>
                    <p className={`${classes.card__text} ${classes.card__text_regular}`}>{pickupLocationAddress}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${pickupLocationAddress} Miami FL,33130, United States`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.summary__link}
                  >
                    <MapIcon />
                    <span>View on the Google Maps</span>
                  </a>
                </div>
              </div>
              <div className={classes.summary__section}>
                <div className={classes.summary__row}>
                  <div className={classes.summary__block}>
                    <p>Return date</p>
                    <p className={`${classes.card__text} ${classes.card__text_regular}`}>{formattedReturnDate}</p>
                  </div>
                </div>
                <div className={classes.summary__row}>
                  <div className={classes.summary__block}>
                    <p>Return location</p>
                    <p className={`${classes.card__text} ${classes.card__text_regular}`}>{returnLocationAddress}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${returnLocationAddress} Miami FL,33130, United States`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.summary__link}
                  >
                    <MapIcon />
                    <span>View on the Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
            <div className={classes.calculation}>
              <div className={classes.calculation__section}>
                <p>Subtotal</p>
                <div className={classes.calculation__block}>
                  <div className={classes.calculation__row}>
                    <p className={classes.calculation__text}>Car rental ({formattedCarPrice}/day)</p>
                    <p className={classes.calculation__text}>{formatCurrency(Number(vehiclePrice) * duration)}</p>
                  </div>
                  <div className={classes.calculation__row}>
                    <p className={classes.calculation__text}>Pick-up</p>
                    <p className={classes.calculation__text}>{Number(pickupLocationPrice) ? formatCurrency(Number(pickupLocationPrice)) : 'FREE'}</p>
                  </div>
                  <div className={classes.calculation__row}>
                    <p className={classes.calculation__text}>Return</p>
                    <p className={classes.calculation__text}>{Number(returnLocationPrice) ? formatCurrency(Number(returnLocationPrice)) : 'FREE'}</p>
                  </div>
                  {additionalServices && additionalServices.length
                    ? additionalServices.map((service, index) => {
                        return (
                          <div key={index} className={classes.calculation__row}>
                            <p className={classes.calculation__text}>
                              {service.name} ({formatCurrency(Number(service.price))}
                              {service.code === 'prepaidFuel' ? null : '/day'})
                            </p>
                            <p className={classes.calculation__text}>
                              {formatCurrency(Number(service.code === 'prepaidFuel' ? service.price : +service.price * duration))}
                            </p>
                          </div>
                        );
                      })
                    : null}
                  <div className={classes.calculation__row}>
                    <p className={classes.calculation__text}>Processing Fee ({processingFee}%)</p>
                    <p className={classes.calculation__text}>{formattedProcessingFeeAmount}</p>
                  </div>
                </div>
              </div>
              <div className={classes.calculation__total}>
                <p className={classes.calculation__result}>Total</p>
                <p className={classes.calculation__result}>{formattedTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
