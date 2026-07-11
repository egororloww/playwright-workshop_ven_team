import { AvailabilityDrawer, Table, TableResults, TableWrapper, Typography } from '@/components';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { formatTableDateMoment, formatTableTimeMoment } from '@/services/helpers/time';
import { CarUnavailableHoursType } from '@/services/types/cars';
import { DeleteUnavailableHours } from '../DeleteUnavailableHours';
import { useDrawer } from '@/services/hooks/useDrawer';
import { CreateAvailabilityForm } from '../CreateAvailabilityForm';
import classes from './index.module.scss';
import { useCarAvailability } from '@/services/fetchers/useCarsAvailability';

export const UnavailableTime = ({ id }: { id: string }): JSX.Element => {
  const { unavailableHours } = useCarAvailability(id);

  const { open, handleClose, handleOpen } = useDrawer();

  const theme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns: max-content max-content 1fr max-content !important;
      `,
    },
  ]);

  const COLUMNS = [
    {
      label: 'From',
      renderCell: (item: CarUnavailableHoursType) => (
        <>
          <Typography component="p" color="dark-080" size="md" textWeight="500">
            {formatTableDateMoment(item.unavailableFrom)}
          </Typography>
          <Typography component="p" color="dark-080" size="sm" textWeight="500">
            {formatTableTimeMoment(item.unavailableFrom)}
          </Typography>
        </>
      ),
    },
    {
      label: 'To',
      renderCell: (item: CarUnavailableHoursType) => (
        <>
          <Typography component="p" color="dark-080" size="md" textWeight="500">
            {formatTableDateMoment(item.unavailableTo)}
          </Typography>
          <Typography component="p" color="dark-080" size="sm" textWeight="500">
            {formatTableTimeMoment(item.unavailableTo)}
          </Typography>
        </>
      ),
    },
    {
      label: 'Comment',
      renderCell: (item: CarUnavailableHoursType) => (
        <Typography component="p" color="dark-080" size="md" textWeight="500">
          {item.comment || ''}
        </Typography>
      ),
    },
    {
      label: '',
      renderCell: (item: CarUnavailableHoursType) => (
        <DeleteUnavailableHours
          comment={item.comment}
          id={item.id}
          vehicleId={item.vehicleId}
          unavailableFrom={item.unavailableFrom}
          unavailableTo={item.unavailableTo}
        />
      ),
    },
  ];

  return (
    <div className={classes.availability}>
      <Typography color="dark" size="regular" textWeight="700">
        Unavailable time
      </Typography>
      <div className={classes.availability__header}>
        <div className={classes.availability__actions}>
          <TableResults results={unavailableHours.length} />
          <Typography onClick={handleOpen} component="button" color="accent" size="sm" textWeight="600" className={classes.availability__button}>
            Set Unavailable Time
          </Typography>
        </div>
        <AvailabilityDrawer handleClose={handleClose} title="Set Unavailable Time" isOpen={open}>
          <CreateAvailabilityForm handleClose={handleClose} />
        </AvailabilityDrawer>
      </div>
      <TableWrapper wrapperClassName={classes.wrapper} wrapperContentClassName={classes.wrapper__content}>
        <Table columns={COLUMNS} nodes={unavailableHours} theme={theme} />
      </TableWrapper>
    </div>
  );
};
