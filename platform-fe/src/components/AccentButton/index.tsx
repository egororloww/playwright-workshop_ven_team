import { ComponentProps, ElementType, ReactNode } from 'react';
import classes from './index.module.scss';

type ButtonOwnProps<E extends ElementType = ElementType> = {
  children: string;
  className?: string;
  isDisabled?: boolean;
  component?: E;
  textGradient?: undefined | 'accent';
  textUppercase?: boolean;
  textWeight?: '600' | '700' | '500';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & Omit<ComponentProps<E>, keyof ButtonOwnProps>;

const defaultElement = 'button';

function AccentButton<E extends ElementType = typeof defaultElement>({
  children,
  className = '',
  component,
  textGradient = undefined,
  textUppercase = false,
  textWeight,
  isDisabled = false,
  startIcon,
  endIcon,
  ...rest
}: ButtonProps<E>): JSX.Element {
  const TagName = component || defaultElement;

  return (
    <TagName
      className={`
    ${classes['button']}   
    ${isDisabled ? classes['button__disabled'] : ''} 
    ${textWeight ? classes['button__' + textWeight] : ''} 
    ${textGradient ? classes['button__textGradient_' + textGradient] : ''} 
    ${textUppercase ? classes['button__textUppercase'] : ''} 
    ${className}`.trim()}
      {...rest}
    >
      {startIcon ? startIcon : null}
      {children ? <span>{children}</span> : null}
      {endIcon ? endIcon : null}
    </TagName>
  );
}

export { AccentButton };
