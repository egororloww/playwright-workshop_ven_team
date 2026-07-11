import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const ListTitle = ({ children }: PropsWithChildren): JSX.Element => {
  return <h3 className={classes.title}>{children}</h3>;
};
