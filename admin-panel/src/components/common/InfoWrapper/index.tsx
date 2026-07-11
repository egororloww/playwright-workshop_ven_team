import classes from './index.module.scss';
import { PropsWithChildren, ReactNode } from 'react';

export const InfoWrapper = ({ children }: PropsWithChildren): ReactNode => {
  return <div className={classes.wrapper}>{children}</div>;
};
