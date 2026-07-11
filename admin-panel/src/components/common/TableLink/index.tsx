import { Link } from 'react-router-dom';
import { ReactComponent as ChevronIcon } from '@icons/chevron-right.svg';

import classes from './index.module.scss';

type ComponentProps = {
  link: string;
};

export const TableLink = ({ link }: ComponentProps): JSX.Element => {
  return (
    <Link className={classes.link} to={link}>
      <ChevronIcon />
    </Link>
  );
};
