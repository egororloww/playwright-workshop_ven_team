import { ComponentProps, ElementType, ReactNode } from 'react';
import classes from './index.module.scss';

type TitleOwnProps<E extends ElementType = ElementType> = {
  children: string | ReactNode;
  className?: string;
  component?: E;
  textUppercase?: boolean;
};

type TitleProps<E extends ElementType> = TitleOwnProps<E> & Omit<ComponentProps<E>, keyof TitleOwnProps>;

const defaultElement = 'h2';

function Title<E extends ElementType = typeof defaultElement>({
  children,
  className = '',
  component,
  textUppercase = true,
  ...rest
}: TitleProps<E>): JSX.Element {
  const TagName = component || defaultElement;

  return (
    <TagName
      className={`
    ${classes['title']} 
    ${textUppercase ? classes['title_uppercase'] : ''} 
    ${className}`.trim()}
      {...rest}
    >
      <span className={classes.title__content}>{children}</span>
    </TagName>
  );
}

export { Title };
