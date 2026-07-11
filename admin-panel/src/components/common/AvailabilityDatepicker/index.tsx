import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Typography } from '../Typography';
import { ReactComponent as LeftIcon } from '@icons/chevron-left.svg';
import { ReactComponent as RightIcon } from '@icons/chevron-right.svg';
import moment from 'moment-timezone';

import classes from './index.module.scss';
import { ReactNode } from 'react';

type ComponentProps = {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: Date) => void;
  selected?: Date | null;
  disabled?: boolean;
  errorMessage?: string;
  label: string;
  placeholderText: string;
};

export const AvailabilityDatepicker = ({
  onChange,
  selected,
  disabled = false,
  errorMessage,
  label,
  placeholderText,
}: ComponentProps): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <Typography size="md" textWeight="600" color="dark-080" component="label" className={classes.label}>
        {label}
      </Typography>
      <DatePicker
        placeholderText={placeholderText}
        onChange={onChange}
        selected={selected}
        showTimeSelect
        dateFormat="MMM d, yyyy h:mm aa"
        onChangeRaw={(e) => e.preventDefault()}
        onFocus={(e) => e.target.blur()}
        timeIntervals={30}
        disabled={disabled}
        calendarClassName={classes.calendar}
        className={`${classes.datepicker} ${errorMessage ? classes.datepicker__error : ''}`}
        renderCustomHeader={CustomHeader}
      />
      {errorMessage && (
        <Typography size="sm" color="accent" textAlign="left" component="p" className={classes.error}>
          {errorMessage}
        </Typography>
      )}
    </div>
  );
};

type CustomHeaderPropsType = {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
};

const CustomHeader = ({ date, decreaseMonth, increaseMonth }: CustomHeaderPropsType): ReactNode => {
  const estDate = moment(date).format('MMMM YYYY');

  return (
    <div className={classes.header}>
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
