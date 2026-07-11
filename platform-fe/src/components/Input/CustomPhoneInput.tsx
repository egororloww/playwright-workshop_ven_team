import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller } from 'react-hook-form';
import classes from './index.module.scss';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  error: boolean;
  disabled?: boolean;
  helperText?: string;
};

export const CustomPhoneInput = ({ control, error, helperText, disabled, ...rest }: Props): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <label htmlFor="phoneNumber" className={classes.label}>
        Phone Number
      </label>
      <Controller
        name="phoneNumber"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        control={control}
        render={({ field: { ref, ...field } }) => (
          <PhoneInput
            {...field}
            prefix="+"
            inputProps={{
              ref,
            }}
            inputClass={`${classes.input} ${error ? classes['input__error'] : ''}`}
            buttonClass={classes.dropdown}
            country={'us'}
            inputStyle={{ width: '100%' }}
            countryCodeEditable={false}
            disabled={disabled}
            {...rest}
          />
        )}
      />
      {error ? <span className={classes.error}>{helperText}</span> : null}
    </div>
  );
};
