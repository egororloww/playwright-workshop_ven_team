import classes from './index.module.scss';
import { PropsWithChildren, ReactNode } from 'react';

type PropsType = {
  wrapperClassName?: string;
  wrapperContentClassName?: string;
};

export const TableWrapper = ({ children, wrapperClassName = '', wrapperContentClassName = '' }: PropsWithChildren<PropsType>): ReactNode => {
  return (
    <div className={`${classes.content} ${wrapperClassName}`}>
      <div className={`${classes.content__table} ${wrapperContentClassName}`}>{children}</div>
    </div>
  );
};
