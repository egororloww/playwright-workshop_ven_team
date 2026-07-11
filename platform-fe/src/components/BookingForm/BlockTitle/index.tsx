import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const BlockTitle = ({ children }: PropsWithChildren): JSX.Element => {
  return <h2 className={classes.title}>{children}</h2>;
};
