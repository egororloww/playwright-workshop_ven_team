import { ComponentProps, ElementType } from 'react';
import classes from './index.module.scss';

type ButtonOwnProps<E extends ElementType = ElementType> = {
  children: string;
  className?: string;
  fullWidth?: boolean;
  isDisabled?: boolean;
  component?: E;
  variant?: 'contained' | 'outlined' | 'text' | 'string';
  textGradient?: undefined | 'white' | 'accent';
  textUppercase?: boolean;
  textColor?: 'white' | 'primary';
  textWeight?: '600' | '700';
  size?: 'lg' | 'md';
};

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & Omit<ComponentProps<E>, keyof ButtonOwnProps>;

const defaultElement = 'button';

function Button<E extends ElementType = typeof defaultElement>({
  children,
  className = '',
  fullWidth = true,
  component,
  variant = 'contained',
  size = 'md',
  textGradient = undefined,
  textUppercase = false,
  textColor = 'white',
  textWeight,
  isDisabled = false,
  ...rest
}: ButtonProps<E>): JSX.Element {
  const TagName = component || defaultElement;

  return (
    <TagName
      className={`
    ${classes['button']} 
    ${classes['button__' + variant]} 
    ${classes['button__' + size]} 
    ${classes['button__' + textColor]} 
    ${isDisabled ? classes['button__disabled'] : ''} 
    ${textWeight ? classes['button__' + textWeight] : ''} 
    ${textGradient ? classes['button__textGradient_' + textGradient] : ''} 
    ${fullWidth ? classes['button__fullWidth'] : ''} 
    ${textUppercase ? classes['button__textUppercase'] : ''} 
    ${className}`.trim()}
      {...rest}
    >
      {children ? <span>{children}</span> : null}
    </TagName>
  );
}

export { Button };
