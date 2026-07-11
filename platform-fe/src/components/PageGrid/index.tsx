import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const PageGrid = ({ children }: PropsWithChildren): JSX.Element => {
  return <div className={classes.wrapper}>{children}</div>;
};
