import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

type ComponentProps = {
  position?: 'left' | 'right' | 'both';
};

export const Line = ({ children, position = 'both' }: PropsWithChildren<ComponentProps>): JSX.Element => {
  return (
    <div
      className={`
    ${classes.line}
    ${classes['line_' + position]} 

  `}
    >
      {children}
    </div>
  );
};
