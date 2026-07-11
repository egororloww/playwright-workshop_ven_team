import { PropsWithChildren, ReactNode } from 'react';
import { ReactComponent as LogoIcon } from '@icons/logo.svg';
import classes from './index.module.scss';
import { getFullYearInEST } from '@/services/helpers/time';
import { Typography } from '@/components/common/Typography';

export const AuthLayout = ({ children }: PropsWithChildren): ReactNode => (
  <div className={classes.wrapper}>
    <div className={classes.content}>
      <div className={classes.content__header}>
        <div className="logo">
          <LogoIcon />
        </div>
        <Typography color="white" size="lg" textWeight="700" component="h1">
          Admin Panel
        </Typography>
      </div>
      {children}
      <div className={classes.content__footer}>
        <Typography color="dark-040" size="sm" textWeight="400" component="p">
          {getFullYearInEST()} ELITE FLEET GROUP (c) All rights reserved
        </Typography>
      </div>
    </div>
  </div>
);
