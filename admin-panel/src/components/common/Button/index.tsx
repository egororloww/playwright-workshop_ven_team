import { ComponentProps, ElementType } from 'react';
import classes from './index.module.scss';

type ButtonOwnProps<E extends ElementType = ElementType> = {
  children: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  component?: E;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'accent' | 'white';
  textGradient?: undefined | 'white' | 'accent';
  textUppercase?: boolean;
  textColor?: 'white' | 'accent';
  textWeight?: '600' | '700';
  textSize?: 'sm' | 'lg' | 'md';
  size?: 'sm' | 'lg' | 'md';
  textShadow?: 'dark';
  IconRight?: React.ComponentType<object>;
  IconLeft?: React.ComponentType<object>;
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
  textWeight = '600',
  disabled = false,
  color = 'accent',
  textShadow = 'dark',
  textSize = 'md',
  IconRight,
  IconLeft,
  ...rest
}: ButtonProps<E>): JSX.Element {
  const TagName = component || defaultElement;

  return (
    <TagName
      className={`
    ${classes['button']} 
    ${classes['button__variant_' + variant]} 
    ${classes['button__color_' + color]} 
    ${classes['button__size_' + size]} 
    ${classes['button__text_color-' + textColor]} 
    ${classes['button__text_size-' + textSize]} 
    ${classes['button__text_shadow-' + textShadow]} 
    ${disabled ? classes['button__disabled'] : ''} 
    ${textWeight ? classes['button__text_weight-' + textWeight] : ''} 
    ${textGradient ? classes['button__text_gradient-' + textGradient] : ''} 
    ${fullWidth ? classes['button__full-width'] : ''} 
    ${textUppercase ? classes['button__text_uppercase'] : ''} 
    ${className}`.trim()}
      {...rest}
    >
      {children ? (
        <>
          {IconLeft && <IconLeft />}
          <span>{children}</span> {IconRight && <IconRight />}
        </>
      ) : null}
    </TagName>
  );
}

export { Button };
