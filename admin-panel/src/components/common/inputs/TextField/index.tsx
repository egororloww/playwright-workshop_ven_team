import { Typography } from '@components';
import { ReactComponent as EyeOnIcon } from '@icons/eye-on.svg';
import { ReactComponent as EyeOffIcon } from '@icons/eye-off.svg';
import classes from './index.module.scss';
import { useState } from 'react';

type ComponentProps = {
  label?: string;
  error?: string;
  type?: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  isError?: boolean;
};

export const TextField = ({ label, name, placeholder, type = 'text', error, disabled, isError = false, ...rest }: ComponentProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  const renderType = (): string => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    } else return type;
  };
  return (
    <div className={`${classes.textfield} ${disabled ? classes.textfield__disabled : ''}`}>
      {label ? (
        <Typography color="dark-080" textAlign="left" textWeight="600" component="label" htmlFor={name}>
          {label}
        </Typography>
      ) : null}
      <div
        className={`${classes.textfield__input} ${error || isError ? classes.textfield__input_error : ''} ${
          type === 'password' ? classes['textfield__password'] : ''
        }`}
      >
        <input autoComplete="new-email" {...rest} type={renderType()} placeholder={placeholder} />
        {type === 'password' ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
          </button>
        ) : null}
      </div>
      {error ? (
        <Typography size="sm" color="accent" textAlign="left" component="p">
          {error}
        </Typography>
      ) : null}
    </div>
  );
};
