import { Button, ContentWrapper, Header, Table, TableResults, TableWrapper, Typography } from '@/components';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useRaffleList } from '@/services/fetchers/useRaffleList';
import { RaffleType } from '@/services/types/user';
import { formatPhoneNumber } from '@/services/helpers';
import { formatTableDateMoment, formatTableTimeMoment } from '@/services/helpers/time';
import classes from './index.module.scss';
import { useGenerateRaffleWinner } from '@/services/fetchers/useGenerateRaffleWinner';

export const Raffle = (): JSX.Element => {
  const { winnersList } = useRaffleList();
  const { generateWinner, isWinnerGenerating, error } = useGenerateRaffleWinner();
  const theme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns:max-content 1fr 1fr 1fr 1fr !important;
      `,
    },
  ]);

  const COLUMNS = [
    {
      label: 'Time',
      renderCell: (item: RaffleType) => (
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
      label: 'First name',
      renderCell: (item: RaffleType) => item.firstName,
    },
    { label: 'Last name', renderCell: (item: RaffleType) => item.lastName },
    { label: 'Email', renderCell: (item: RaffleType) => item.email },
    {
      label: 'Phone number',
      renderCell: (item: RaffleType) => formatPhoneNumber(item.phoneNumber),
    },
  ];
  return (
    <ContentWrapper>
      <div className={classes.header}>
        <Header>
          <Typography color="dark" size="lg" textWeight="700">
            Raffle
          </Typography>
        </Header>
        <Button
          onClick={generateWinner}
          disabled={isWinnerGenerating || error}
          className={`${classes.button} ${classes.button__desktop}`}
          type="button"
          fullWidth={false}
          size="md"
        >
          SELECT WINNER
        </Button>
      </div>
      <div className={classes.actions}>
        <TableResults results={winnersList.length} />
        <Button
          onClick={generateWinner}
          disabled={isWinnerGenerating || error}
          className={`${classes.button} ${classes.button__mobile}`}
          type="button"
          fullWidth={false}
          size="md"
        >
          SELECT WINNER
        </Button>
      </div>

      {error ? (
        <Typography size="sm" color="accent" textAlign="left" component="p">
          All participants of this raffle were already selected as winners
        </Typography>
      ) : null}

      <TableWrapper>
        <Table columns={COLUMNS} nodes={winnersList} theme={theme} />
      </TableWrapper>
    </ContentWrapper>
  );
};
