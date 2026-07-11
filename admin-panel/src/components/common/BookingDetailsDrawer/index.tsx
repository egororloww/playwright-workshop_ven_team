import Drawer from 'react-modern-drawer';
import classes from './index.module.scss';
import { ReactComponent as CloseIcon } from '@icons/close.svg';
import { ReactComponent as LinkIcon } from '@icons/link.svg';
import { ReactComponent as MapIcon } from '@icons/map.svg';
import { StatusBadge, Typography } from '@components';
import FieldComponent from '@components/common/BookingDetailsDrawer/FieldComponent.tsx';
import { useAxios } from '@api/useAxios.ts';
import { BookingType } from '@services/types/bookings.ts';
import { useEffect, useState } from 'react';
import { formatBookingCreatedAtDateMoment } from '@/services/helpers/time';
import { formatCurrency } from '@/services/helpers';
import { Link } from 'react-router-dom';

type Props = {
  bookingId: number | null;
  onClose: () => void;
};

const BookingDetailsDrawer: React.FC<Props> = ({ bookingId, onClose }) => {
  const { api } = useAxios();
  const [bookingInfo, setBookingInfo] = useState<BookingType | null>(null);
  async function fetchBookingsList({ bookingId }: { bookingId: number }): Promise<BookingType> {
    const {
      data: { bookings },
    }: { data: { bookings: BookingType } } = await api.get(`/bookings/${bookingId}/admin`);

    return bookings;
  }

  useEffect(() => {
    if (bookingId) {
      void fetchBookingsList({ bookingId }).then((bookings) => {
        setBookingInfo(bookings);
      });
    }
  }, [bookingId]);

  const handleClose = (): void => {
    onClose();
    setBookingInfo(null);
  };

  return (
    <Drawer
      open={!!bookingId}
      direction="right"
      className={classes.drawer}
      overlayClassName={classes.overlay}
      lockBackgroundScroll={false}
      overlayOpacity={0.2}
      zIndex={1001}
      onClose={handleClose}
    >
      <button className={classes.drawer__button} onClick={handleClose}>
        <CloseIcon />
      </button>
      {bookingInfo && (
        <>
          <Typography color="dark" textWeight="700" size="lg" className={classes.drawer__title} component="h3">
            <div>ID {bookingId}</div> <StatusBadge status={bookingInfo.status} fullWidth={false} />
          </Typography>
          <div className={classes.drawer__content}>
            <div className={classes.header_block}>
              <FieldComponent label="Booking date">{formatBookingCreatedAtDateMoment(bookingInfo.createdAt)}</FieldComponent>
              <FieldComponent label="Customer">
                <div className={classes.flex_content}>
                  {`${bookingInfo.user.firstName} ${bookingInfo.user.lastName}`}
                  <Link to={`/customers/${bookingInfo.user.id}`}>
                    <LinkIcon />
                  </Link>
                </div>
              </FieldComponent>
              <FieldComponent label="Pick-up date">{formatBookingCreatedAtDateMoment(bookingInfo.pickupDate)}</FieldComponent>
              <FieldComponent label="Return date">{formatBookingCreatedAtDateMoment(bookingInfo.returnDate)}</FieldComponent>
            </div>
            <FieldComponent label="Pick-up location">
              <div className={classes.flex_content}>
                {bookingInfo.pickupLocationAddress}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${bookingInfo.pickupLocationAddress?.split(' ').join('+')}`}
                  target="_blank"
                >
                  <MapIcon />
                </a>
              </div>
            </FieldComponent>
            <FieldComponent label="Return location">
              <div className={classes.flex_content}>
                {bookingInfo.returnLocationAddress}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${bookingInfo.returnLocationAddress?.split(' ').join('+')}`}
                  target="_blank"
                >
                  <MapIcon />
                </a>
              </div>
            </FieldComponent>
            <FieldComponent label="Total">{formatCurrency(bookingInfo.totalAmount)}</FieldComponent>
            <Typography className={classes.availability__button} component={Link} to={`/bookings/${bookingId}`} textWeight="600">
              Go to Booking Page
            </Typography>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default BookingDetailsDrawer;
