import { ContentWrapper, Header, InfoWrapper, PdfView, StatusBadge, Typography } from '@/components';
import { Link, useParams } from 'react-router-dom';

import { ReactComponent as ChevronIcon } from '@icons/chevron-right.svg';
import { ReactComponent as LinkIcon } from '@icons/link.svg';
import { ReactComponent as MapIcon } from '@icons/map.svg';
import { useBookingInfo } from '@/services/fetchers/useBookingInfo';
import { calculateDifferenceBetweenTwoDates, formatBookingCreatedAtDateMoment } from '@/services/helpers/time';
import { formatCurrency } from '@/services/helpers';

import { ActionsMenu } from '../ActionsMenu';
import classes from './index.module.scss';

export const BookingInfo = (): JSX.Element => {
  const { id } = useParams();
  const { bookingInfo } = useBookingInfo(id as string);

  // eslint-disable-next-line no-console

  const deliveryPrice = Number(bookingInfo.pickupLocationPrice) + Number(bookingInfo.returnLocationPrice);
  const rentDuration = calculateDifferenceBetweenTwoDates(bookingInfo.pickupDate, bookingInfo.returnDate);
  const rentPrice = rentDuration * Number(bookingInfo.vehiclePrice);
  const prepaidFuel = bookingInfo.additionalServices?.find((service) => service.name === 'Prepaid fuel');
  const unlimitedToll = bookingInfo.additionalServices?.find((service) => service.name === 'Unlimited toll');
  const unlimitedMiles = bookingInfo.additionalServices?.find((service) => service.name === 'Unlimited miles');

  const servicesPrice =
    Number(prepaidFuel ? prepaidFuel.price : 0) +
    rentDuration * (Number(unlimitedToll ? unlimitedToll.price : 0) + Number(unlimitedMiles ? unlimitedMiles.price : 0));

  return (
    <ContentWrapper>
      <Header>
        <div className={classes.header}>
          <div className={classes.header__navigation}>
            <Typography className={classes.header__link} component={Link} to={'/bookings'} color="dark-060" size="lg" textWeight="700">
              Bookings
            </Typography>
            <ChevronIcon className={classes.header__icon} />
            <div className={classes.header__booking}>
              <Typography className={classes.header__name} color="dark" size="lg" textWeight="700">
                ID {bookingInfo.id}
              </Typography>
              <StatusBadge status={bookingInfo.status} />
            </div>
          </div>
          <ActionsMenu status={bookingInfo.status} bookingId={id as string} userId={bookingInfo.user.id} />
        </div>
      </Header>
      <InfoWrapper>
        <div className={classes.wrapper}>
          <div className={classes.data}>
            <Typography size="regular">General</Typography>
            <div className={classes.info}>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  ID
                </Typography>
                <Typography size="md" textWeight="500">
                  {bookingInfo.id}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Booking date
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatBookingCreatedAtDateMoment(bookingInfo.createdAt)}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Car
                </Typography>
                <div className={classes.block__redirect}>
                  <Typography size="md" textWeight="500">
                    {bookingInfo.vehicle.make + ' ' + bookingInfo.vehicle.model}
                  </Typography>
                  <Link to={`/cars/${bookingInfo.vehicle.id}`}>
                    <LinkIcon />
                  </Link>
                </div>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Customer
                </Typography>
                <div className={classes.block__redirect}>
                  <Typography size="md" textWeight="500">
                    {bookingInfo.user.firstName + ' ' + bookingInfo.user.lastName}
                  </Typography>
                  <Link to={`/customers/${bookingInfo.user.id}`}>
                    <LinkIcon />
                  </Link>
                </div>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Pick-up date
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatBookingCreatedAtDateMoment(bookingInfo.pickupDate)}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Return date
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatBookingCreatedAtDateMoment(bookingInfo.returnDate)}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Pick-up location
                </Typography>
                <div className={classes.block__redirect}>
                  <Typography size="md" textWeight="500">
                    {bookingInfo.pickupLocationAddress}
                  </Typography>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${bookingInfo.pickupLocationAddress?.split(' ').join('+')}`}
                    target="_blank"
                  >
                    <MapIcon />
                  </a>
                </div>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Return location
                </Typography>
                <div className={classes.block__redirect}>
                  <Typography size="md" textWeight="500">
                    {bookingInfo.returnLocationAddress}
                  </Typography>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${bookingInfo.returnLocationAddress?.split(' ').join('+')}`}
                    target="_blank"
                  >
                    <MapIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.data}>
            <Typography size="regular">Documents</Typography>
            <div className={classes.documents}>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Driver license
                </Typography>

                {bookingInfo.user.driverLicenseImage1Url ? (
                  bookingInfo.user.driverLicenseImage1Url.includes('.pdf') ? (
                    <PdfView fileName={bookingInfo.user.driverLicenseImage1OriginalKey} fileLink={bookingInfo.user.driverLicenseImage1Url} />
                  ) : (
                    <div className={`${classes.image} ${classes.image__card}`}>
                      <div className={`${classes.block__image} ${classes.block__image_card}`}>
                        <img src={bookingInfo.user.driverLicenseImage1Url} alt="image" width={167} />
                      </div>
                    </div>
                  )
                ) : (
                  '-'
                )}
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Driver license
                </Typography>

                {bookingInfo.user.driverLicenseImage2Url ? (
                  bookingInfo.user.driverLicenseImage2Url.includes('.pdf') ? (
                    <PdfView fileName={bookingInfo.user.driverLicenseImage2OriginalKey} fileLink={bookingInfo.user.driverLicenseImage2Url} />
                  ) : (
                    <div className={`${classes.image} ${classes.image__card}`}>
                      <div className={`${classes.block__image} ${classes.block__image_card}`}>
                        <img src={bookingInfo.user.driverLicenseImage2Url} alt="image" width={167} />
                      </div>
                    </div>
                  )
                ) : (
                  '-'
                )}
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Insurance card
                </Typography>

                {bookingInfo.user.insuranceCardImageUrl ? (
                  bookingInfo.user.insuranceCardImageUrl.includes('.pdf') ? (
                    <PdfView fileName={bookingInfo.user.insuranceCardImageOriginalKey} fileLink={bookingInfo.user.insuranceCardImageUrl} />
                  ) : (
                    <div className={`${classes.image} ${classes.image__card}`}>
                      <div className={`${classes.block__image} ${classes.block__image_card}`}>
                        <img src={bookingInfo.user.insuranceCardImageUrl} alt="image" width={167} />
                      </div>
                    </div>
                  )
                ) : (
                  '-'
                )}
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Declaration page
                </Typography>

                {bookingInfo.user.insuranceDeclarationPageImageUrl ? (
                  bookingInfo.user.insuranceDeclarationPageImageUrl.includes('.pdf') ? (
                    <PdfView
                      fileName={bookingInfo.user.insuranceDeclarationPageImageOriginalKey}
                      fileLink={bookingInfo.user.insuranceDeclarationPageImageUrl}
                    />
                  ) : (
                    <div className={`${classes.image} ${classes.image__card}`}>
                      <div className={`${classes.block__image} ${classes.block__image_page}`}>
                        <img src={bookingInfo.user.insuranceDeclarationPageImageUrl} alt="image" width={167} />
                      </div>
                    </div>
                  )
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>

          <div className={classes.services}>
            <div className={classes.calculation}>
              <Typography size="regular">Additional Services</Typography>
              <div className={classes.calculation__row}>
                <div className={classes.block}>
                  <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                    Prepaid fuel
                  </Typography>
                  <Typography size="md" textWeight="500">
                    {prepaidFuel ? `Yes (${formatCurrency(prepaidFuel.price)})` : '-'}
                  </Typography>
                </div>
                <div className={classes.block}>
                  <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                    Unlimited toll
                  </Typography>
                  <Typography size="md" textWeight="500">
                    {unlimitedToll ? `Yes (${formatCurrency(unlimitedToll.price)}/day)` : '-'}
                  </Typography>
                </div>
                <div className={classes.block}>
                  <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                    Unlimited miles
                  </Typography>
                  <Typography size="md" textWeight="500">
                    {unlimitedMiles ? `Yes (${formatCurrency(unlimitedMiles.price)}/day)` : '-'}
                  </Typography>
                </div>
              </div>
            </div>
            <div className={classes.calculation}>
              <Typography size="regular">Delivery</Typography>
              <div className={classes.calculation__row}>
                <div className={classes.block}>
                  <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                    Pick-up
                  </Typography>
                  <Typography size="md" textWeight="500">
                    {Number(bookingInfo.pickupLocationPrice) ? `Yes (${formatCurrency(bookingInfo.pickupLocationPrice as string)})` : `-`}
                  </Typography>
                </div>
                <div className={classes.block}>
                  <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                    Return
                  </Typography>
                  <Typography size="md" textWeight="500">
                    {Number(bookingInfo.returnLocationPrice) ? `Yes (${formatCurrency(bookingInfo.returnLocationPrice as string)})` : `-`}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.calculation}>
            <Typography size="regular">Payment</Typography>
            <div className={classes.calculation__row}>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Car rental
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatCurrency(rentPrice)} ({formatCurrency(bookingInfo.vehiclePrice as string)}/day)
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Delivery
                </Typography>
                <Typography size="md" textWeight="500">
                  {deliveryPrice ? formatCurrency(deliveryPrice) : '-'}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Additional services
                </Typography>
                <Typography size="md" textWeight="500">
                  {servicesPrice ? formatCurrency(servicesPrice) : '-'}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Processing Fee ({bookingInfo.processingFee}%)
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatCurrency(bookingInfo.processingFeeAmount as string)}
                </Typography>
              </div>
              <div className={classes.block}>
                <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                  Total
                </Typography>
                <Typography size="md" textWeight="500">
                  {formatCurrency(bookingInfo.totalAmount)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </InfoWrapper>
    </ContentWrapper>
  );
};
