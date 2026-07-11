import { ComponentProps, ElementType, useState } from 'react';
import { ReactComponent as EyeIcon } from '@icons/eye.svg';
import { ReactComponent as EyeOffIcon } from '@icons/eye-off.svg';
import classes from './index.module.scss';

type InputOwnProps<E extends ElementType = ElementType> = {
  className?: string;
  component?: E;
  name: string;
  label?: string;
  error?: boolean;
  isDisabled?: boolean;
  helperText?: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
};

type InputProps<E extends ElementType> = InputOwnProps<E> & Omit<ComponentProps<E>, keyof InputOwnProps>;

const defaultElement = 'input';

function Input<E extends ElementType = typeof defaultElement>({
  className = '',
  component,
  name,
  error,
  helperText,
  register,
  label,
  type = 'text',
  isDisabled = false,
  ...rest
}: InputProps<E>): JSX.Element {
  const TagName = component || defaultElement;
  const [show, setShow] = useState(false);

  const renderType = (): string => {
    if (type === 'password') {
      return show ? 'text' : 'password';
    } else return type;
  };

  return (
    <div className={classes.wrapper}>
      {label ? (
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
      ) : null}
      <div className={`${classes.inputWrapper} ${type === 'password' ? classes['inputWrapper__password'] : ''}`}>
        <TagName
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          {...register(name)}
          type={renderType()}
          autoComplete="new-password"
          className={`
    ${classes['input']} 
    ${error ? classes['input__error'] : ''}  
    ${className}`.trim()}
          disabled={isDisabled}
          {...rest}
        />
        {type === 'password' ? (
          <button
            className={classes.inputWrapper__button}
            onClick={(e) => {
              e.preventDefault();
              setShow(!show);
            }}
          >
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        ) : null}
      </div>
      {error ? <span className={classes.error}>{helperText}</span> : null}
    </div>
  );
}

export { Input };
