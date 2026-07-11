import { NavLink } from 'react-router-dom';
import classes from './index.module.scss';
import { Typography } from '../Typography';

type ComponentProps = {
  tab1: {
    href: string;
    text: string;
  };
  tab2: {
    href: string;
    text: string;
  };
};

export const Tabs = ({ tab1, tab2 }: ComponentProps): JSX.Element => {
  return (
    <div className={classes.tabs}>
      <Typography end color="dark-080" textWeight="700" textAlign="center" className={classes.tabs__link} component={NavLink} to={tab1.href}>
        {tab1.text}
      </Typography>
      <Typography end color="dark-080" textWeight="700" textAlign="center" className={classes.tabs__link} component={NavLink} to={tab2.href}>
        {tab2.text}
      </Typography>
    </div>
  );
};
