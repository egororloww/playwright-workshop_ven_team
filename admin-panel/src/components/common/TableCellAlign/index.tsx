import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

type Props = {
  align?: 'center' | 'left' | 'right';
};

export const TableCellAlign = ({ children, align = 'right' }: PropsWithChildren<Props>): JSX.Element => {
  return <span className={`${classes.wrapper} ${classes['wrapper__' + align]}`}>{children}</span>;
};
