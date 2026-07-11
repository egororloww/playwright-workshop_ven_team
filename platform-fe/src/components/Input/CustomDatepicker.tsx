import { useState } from 'react';
import { ReactComponent as Icon } from '@icons/calendar.svg';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './index.module.scss';
export interface BookingDates {
  startDate: string;
  endDate: string;
}
type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  error: boolean;
  disabled?: boolean;
  helperText?: string;
  defaultValues?: BookingDates | null;
};

export const CustomDatepicker = ({ control, error, disabled, helperText, defaultValues }: Props): JSX.Element => {
  const [startDate, setStartDate] = useState<Date | null>(defaultValues?.startDate ? new Date(defaultValues.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    defaultValues?.endDate
      ? new Date(defaultValues.endDate)
      : defaultValues?.endDate === null
        ? null
        : new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
  );
  const onChange = (dates: Array<Date | null>): void => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleInputChange = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
  };

  return (
    <div className={classes.wrapper}>
      <label className={classes.label}>Pick-up & Return date</label>
      <Controller
        name="bookingDates"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        control={control}
        defaultValue={{ startDate, endDate }}
        render={({ field }) => {
          return (
            <ReactDatePicker
              showIcon
              icon={<Icon />}
              monthsShown={2}
              minDate={new Date()}
              selected={startDate}
              onChange={(date) => {
                field.onChange({ startDate: date[0], endDate: date[1] });
                onChange(date);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat={'d MMMM'}
              disabled={disabled}
              className={`${classes.input} ${error ? classes['input__error'] : ''}`}
              onChangeRaw={handleInputChange}
              onFocus={(e) => e.target.blur()}
            />
          );
        }}
      />
      {error ? <span className={classes.error}>{helperText}</span> : null}
    </div>
  );
};
