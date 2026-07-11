/* eslint-disable no-unused-vars */
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as LeftIcon } from '@icons/chevron-left.svg';
import { ReactComponent as RightIcon } from '@icons/chevron-right.svg';
import { ReactNode, useEffect, useState } from 'react';
import { getDates, getEndDateOf, getStartDateOf, transformTimeZoneToLocal } from '@/services/helpers/time';
import { Typography } from '@/components';
import { CarAvailabilityScheduleType } from '@/services/types/cars';
import moment from 'moment-timezone';
import classes from './index.module.scss';

type PropsType = {
  setMonthSearchParams: (args: SearchParamsType) => void;
  setStartDate: (args: Date) => void;
  availabilitySchedule: CarAvailabilityScheduleType[];
  monthSearchParams: SearchParamsType;
  startDate: Date | null;
  isLoading?: boolean;
};
type SearchParamsType = { dateFrom: string; dateTo: string };

type CustomHeaderPropsType = {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
};

export const ScheduleDatepicker = ({
  setMonthSearchParams,
  setStartDate,
  availabilitySchedule,
  monthSearchParams,
  startDate,
  isLoading,
}: PropsType): ReactNode => {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

  const onMonthChange = (date: Date): void => {
    setMonthSearchParams({
      dateFrom: getStartDateOf(date, 'month').parseZone().tz('America/New_York', true).toISOString(),
      dateTo: getEndDateOf(date, 'month').parseZone().tz('America/New_York', true).toISOString(),
    });
  };

  const onDateChange = (date: Date): void => {
    setStartDate(new Date(getStartDateOf(date, 'day').format('MMMM DD, YYYY, hh:mm A')));
  };

  useEffect(() => {
    setHighlightedDates(
      availabilitySchedule.reduce((acc: Date[], item) => {
        const dates = getDates(item.dateFrom, item.dateTo);
        dates.forEach((date, index) => {
          // check last date 12:00 AM
          if (dates.length > 1 && index === dates.length - 1) {
            const dateInNewYork = moment(date).tz('America/New_York');
            const isEndOfTheDay = dateInNewYork.hours() === 0 && dateInNewYork.minutes() === 0 && dateInNewYork.seconds() === 0;
            const convertedDay = isEndOfTheDay ? dateInNewYork.subtract(1, 'minutes') : dateInNewYork;
            const newDate = transformTimeZoneToLocal(convertedDay.toISOString());
            acc.push(newDate);
          } else {
            const newDate = transformTimeZoneToLocal(date);
            acc.push(newDate);
          }
        });
        return acc;
      }, [])
    );
  }, [availabilitySchedule, monthSearchParams]);

  return (
    <DatePicker
      disabled={isLoading}
      onMonthChange={onMonthChange}
      selected={startDate}
      onChange={onDateChange}
      inline
      highlightDates={highlightedDates}
      calendarClassName={classes.calendar}
      className={classes.datepicker}
      renderCustomHeader={CustomHeader}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
      onChangeRaw={(e) => e.preventDefault()}
      onFocus={(e) => e.target.blur()}
      disabledKeyboardNavigation={true}
    />
  );
};

const CustomHeader = ({ date, decreaseMonth, increaseMonth }: CustomHeaderPropsType): ReactNode => {
  const estDate = moment(date).format('MMMM YYYY');

  return (
    <div className={classes.header} key={date.toISOString()}>
      <Typography color="dark" size="regular" textWeight="700" className={classes.header__date}>
        {estDate}
      </Typography>
      <div className={classes.header__actions}>
        <button type="button" className={classes.button} onClick={decreaseMonth}>
          <LeftIcon />
        </button>
        <button type="button" className={classes.button} onClick={increaseMonth}>
          <RightIcon />
        </button>
      </div>
    </div>
  );
};
