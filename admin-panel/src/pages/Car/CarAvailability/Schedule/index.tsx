import { ReactNode, useContext } from 'react';
import { ScheduleDatepicker } from '../ScheduleDatepicker';
import { ScheduleCalendar } from '../ScheduleCalendar';
import classes from './index.module.scss';
import { TableWrapper } from '@/components';
import { CarAvailabilityContext } from '@pages/Car/CarAvailability/CarAvailabilityContext';

export const Schedule = (): ReactNode => {
  const { isLoading, startDate, setStartDate, setMonthSearchParams, monthSearchParams, availabilityScheduleMonth, availabilityScheduleDay } =
    useContext(CarAvailabilityContext);

  return (
    <TableWrapper wrapperClassName={classes.wrapper} wrapperContentClassName={classes.wrapper__content}>
      <div className={classes.schedule}>
        <ScheduleDatepicker
          isLoading={isLoading}
          startDate={startDate}
          setStartDate={setStartDate}
          setMonthSearchParams={setMonthSearchParams}
          availabilitySchedule={availabilityScheduleMonth}
          monthSearchParams={monthSearchParams}
        />
        <ScheduleCalendar availabilitySchedule={availabilityScheduleDay} startDate={startDate} />
      </div>
    </TableWrapper>
  );
};
