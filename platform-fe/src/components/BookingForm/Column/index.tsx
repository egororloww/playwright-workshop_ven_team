import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const Column = ({ children }: PropsWithChildren): JSX.Element => {
  return <div className={classes.column}>{children}</div>;
};
