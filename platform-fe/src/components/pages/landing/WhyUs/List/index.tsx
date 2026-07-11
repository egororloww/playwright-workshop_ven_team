import { Card } from './Card';
import classes from './index.module.scss';
import { list } from './list';

export const List = (): JSX.Element => {
  return (
    <ul className={classes.list}>
      {list.map(({ title, icon, text }, i) => (
        <li key={i}>
          <Card title={title} icon={icon} text={text} />
        </li>
      ))}
    </ul>
  );
};
