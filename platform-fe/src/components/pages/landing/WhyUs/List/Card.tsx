import { ItemType } from './list';
import classes from './index.module.scss';

export const Card = ({ icon, title, text }: ItemType): JSX.Element => (
  <div className={classes.card}>
    <div>{icon}</div>
    <article>
      <h3 className={classes.card__title}>{title}</h3>
      <p>{text}</p>
    </article>
  </div>
);
