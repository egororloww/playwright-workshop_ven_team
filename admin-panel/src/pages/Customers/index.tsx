import { ContentWrapper, Header, Table, TableLink, TableResults, TableWrapper, Typography } from '@/components';
import { useCustomersList } from '@/services/fetchers/useCustomersList';
import { CustomerType } from '@/services/types/customers';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { formatCurrency } from '@/services/helpers';

export const Customers = (): JSX.Element => {
  const { customersList } = useCustomersList();
  const theme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns: 1fr 1fr 1fr max-content max-content max-content max-content !important;
      `,
      BaseCell: `
        
        &:nth-of-type(5) {
          text-align:right;
        }
        &:nth-of-type(6) {
          text-align:right;
        }
      `,
    },
  ]);

  const COLUMNS = [
    { label: 'Email', renderCell: (item: CustomerType) => item.email },
    {
      label: 'First name',
      renderCell: (item: CustomerType) => item.firstName,
    },
    { label: 'Last name', renderCell: (item: CustomerType) => item.lastName },
    {
      label: 'Phone number',
      renderCell: (item: CustomerType) => item.phoneNumber,
    },
    { label: 'Bookings', renderCell: (item: CustomerType) => item.bookingsCount },
    { label: 'Total revenue', renderCell: (item: CustomerType) => formatCurrency(item.totalRevenue) },
    {
      label: '',
      renderCell: (item: CustomerType) => <TableLink link={`/customers/${item.id}`} />,
    },
  ];
  return (
    <ContentWrapper>
      <Header>
        <Typography color="dark" size="lg" textWeight="700">
          Customers
        </Typography>
      </Header>
      <TableResults results={customersList.length} />

      <TableWrapper>
        <Table columns={COLUMNS} nodes={customersList} theme={theme} />
      </TableWrapper>
    </ContentWrapper>
  );
};
