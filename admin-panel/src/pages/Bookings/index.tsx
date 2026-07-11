import { ContentWrapper, Header, StatusBadge, Table, TableLink, TableResults, TableWrapper, Typography } from '@/components';
import { useBookingsList } from '@/services/fetchers/useBookingsList';
import { BookingType } from '@/services/types/bookings';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { formatCurrency } from '@/services/helpers';
import { formatTableDateMoment, formatTableTimeMoment } from '@/services/helpers/time';

export const Bookings = (): JSX.Element => {
  const { bookingsList } = useBookingsList();

  const theme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns: max-content max-content max-content 1fr 1fr max-content max-content max-content max-content !important;
      `,
      BaseCell: `
        &:nth-of-type(1) {
          left: 0px;
        }
        &:nth-of-type(2) {
          text-align:center;
        }
        &:nth-of-type(8) {
          text-align:right;
        }
      `,
    },
  ]);

  const COLUMNS = [
    {
      label: 'ID',
      renderCell: (item: BookingType) => item.id,
      pinLeft: true,
    },
    {
      label: 'Status',
      renderCell: (item: BookingType) => <StatusBadge status={item.status} fullWidth={true} />,
    },
    {
      label: 'Booking date',
      renderCell: (item: BookingType) => (
        <>
          <Typography component="p" color="dark-080" size="md" textWeight="500">
            {formatTableDateMoment(item.createdAt)}
          </Typography>
          <Typography component="p" color="dark-080" size="sm" textWeight="500">
            {formatTableTimeMoment(item.createdAt)}
          </Typography>
        </>
      ),
    },
    {
      label: 'Car',
      renderCell: (item: BookingType) => item.vehicle.make + ' ' + item.vehicle.model,
    },
    { label: 'Customer', renderCell: (item: BookingType) => item.user.firstName + ' ' + item.user.lastName },
    {
      label: 'Pick-up date',
      renderCell: (item: BookingType) => (
        <>
          <Typography component="p" color="dark-080" size="md" textWeight="500">
            {formatTableDateMoment(item.pickupDate)}
          </Typography>
          <Typography component="p" color="dark-080" size="sm" textWeight="500">
            {formatTableTimeMoment(item.pickupDate)}
          </Typography>
        </>
      ),
    },
    {
      label: 'Return date',
      renderCell: (item: BookingType) => (
        <>
          <Typography component="p" color="dark-080" size="md" textWeight="500">
            {formatTableDateMoment(item.returnDate)}
          </Typography>
          <Typography component="p" color="dark-080" size="sm" textWeight="500">
            {formatTableTimeMoment(item.returnDate)}
          </Typography>
        </>
      ),
    },
    { label: 'Total', renderCell: (item: BookingType) => formatCurrency(item.totalAmount) },
    { label: '', renderCell: (item: BookingType) => <TableLink link={`/bookings/${item.id}`} /> },
  ];

  return (
    <ContentWrapper>
      <Header>
        <Typography color="dark" size="lg" textWeight="700">
          Bookings
        </Typography>
      </Header>
      <TableResults results={bookingsList.length} />
      <TableWrapper>
        <Table columns={COLUMNS} nodes={bookingsList} theme={theme} />
      </TableWrapper>
    </ContentWrapper>
  );
};
