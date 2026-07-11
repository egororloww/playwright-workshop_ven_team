import { Button, ContentWrapper, Header, Table, TableLink, TableResults, TableWrapper, Typography } from '@/components';
import { useCarsList } from '@/services/fetchers/useCarsList';
import { CarType } from '@/services/types/cars';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { formatCurrency } from '@/services/helpers';
import { Link } from 'react-router-dom';

export const Cars = (): JSX.Element => {
  const { carsList } = useCarsList();

  const theme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns: 6.5rem 1fr 1fr max-content max-content max-content max-content max-content !important;
      `,
      BaseCell: `
        &:nth-of-type(1) {
          left: 0px;
        }
        &:nth-of-type(4) {
          text-align: right;
        }
        &:nth-of-type(5) {
          text-align: center;
        }
        &:nth-of-type(6) {
          text-align: center;
        }
        &:nth-of-type(7) {
          text-align: center;
        }
      `,
    },
  ]);

  const COLUMNS = [
    {
      label: 'Image',
      renderCell: (item: CarType) => <img src={item.normalImageUrl} alt="Car" width={80} height={45} />,
      pinLeft: true,
    },
    {
      label: 'Make',
      renderCell: (item: CarType) => item.make,
    },
    { label: 'Model', renderCell: (item: CarType) => item.model },
    {
      label: 'Price per day',
      renderCell: (item: CarType) => formatCurrency(item.price),
    },
    { label: 'Fuel type', renderCell: (item: CarType) => item.fuelType },
    { label: 'Doors', renderCell: (item: CarType) => item.doors },
    { label: 'Seats', renderCell: (item: CarType) => item.seats },
    { label: '', renderCell: (item: CarType) => <TableLink link={`/cars/${item.id}`} /> },
  ];

  return (
    <ContentWrapper>
      <Header>
        <Typography color="dark" size="lg" textWeight="700">
          Cars
        </Typography>
        <Button component={Link} to="/cars/create" fullWidth={false} style={{ marginLeft: 'auto' }}>
          + ADD CAR
        </Button>
      </Header>
      <TableResults results={carsList.length} />

      <TableWrapper>
        <Table columns={COLUMNS} nodes={carsList} theme={theme} />
      </TableWrapper>
    </ContentWrapper>
  );
};
