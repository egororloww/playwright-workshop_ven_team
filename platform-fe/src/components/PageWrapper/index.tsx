import { PropsWithChildren } from 'react';
import classes from './index.module.scss';

type Props = {
  contentPosition?: 'center';
};

export const PageWrapper = ({ children, contentPosition }: PropsWithChildren<Props>): JSX.Element => {
  return <div className={`${classes.wrapper} ${contentPosition ? classes['wrapper__' + contentPosition] : ''}`}>{children}</div>;
};
