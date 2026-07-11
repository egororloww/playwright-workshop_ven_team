import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const Price = ({ children }: PropsWithChildren): JSX.Element => {
  return <p className={classes.price}>{children}</p>;
};
