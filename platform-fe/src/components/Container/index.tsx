import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

type Props = {
  maxWidth?: 'lg' | 'md' | 'xlg';
};

export const Container = ({ children, maxWidth = 'lg' }: PropsWithChildren<Props>): JSX.Element => {
  return (
    <div
      className={`
  ${classes.container}
  ${classes['container__' + maxWidth]}
  `}
    >
      {children}
    </div>
  );
};
