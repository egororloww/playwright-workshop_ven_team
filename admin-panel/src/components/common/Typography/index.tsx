import { ComponentProps, ElementType, ReactNode } from 'react';
import classes from './index.module.scss';

type TypographyOwnProps<E extends ElementType = ElementType> = {
  children: string | ReactNode;
  className?: string;
  component?: E;
  textUppercase?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  textWeight?: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textUnderline?: boolean;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md' | 'lg' | 'xlg' | 'regular';
  color?: 'dark' | 'white' | 'dark-040' | 'dark-060' | 'dark-080' | 'accent';
};

type TypographyProps<E extends ElementType> = TypographyOwnProps<E> & Omit<ComponentProps<E>, keyof TypographyOwnProps>;

const defaultElement = 'h2';

function Typography<E extends ElementType = typeof defaultElement>({
  children,
  className = '',
  component,
  textUppercase,
  variant,
  size,
  color,
  textAlign,
  textWeight,
  textUnderline,
  ...rest
}: TypographyProps<E>): JSX.Element {
  const TagName = component || defaultElement;

  return (
    <TagName
      className={`
    ${classes['text']} 
    ${textUppercase ? classes['text__uppercase'] : ''} 
    ${textUnderline ? classes['text__underline'] : ''} 
    ${variant ? classes['text__variant_' + variant] : ''} 
    ${size ? classes['text__size_' + size] : ''} 
    ${color ? classes['text__color_' + color] : ''} 
    ${textAlign ? classes['text__align_' + textAlign] : ''} 
    ${textWeight ? classes['text__weight_' + textWeight] : ''} 
    ${className}`.trim()}
      {...rest}
    >
      {children}
    </TagName>
  );
}

export { Typography };
