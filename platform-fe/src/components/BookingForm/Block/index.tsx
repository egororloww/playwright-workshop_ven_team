import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

export const Block = ({ children }: PropsWithChildren): JSX.Element => {
  return <div className={classes.block}>{children}</div>;
};
