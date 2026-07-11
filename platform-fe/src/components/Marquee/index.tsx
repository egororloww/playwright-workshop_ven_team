import { logos } from './logos';
import classes from './index.module.scss';

export const Marquee = (): JSX.Element => {
  return (
    <div className={classes.marquee}>
      <ul className={`${classes.marquee__list}`}>
        {logos.map((logo, i) => (
          <li key={i}>{logo}</li>
        ))}
      </ul>
      <ul aria-hidden="true" className={`${classes.marquee__list}`}>
        {logos.map((logo, i) => (
          <li key={i}>{logo}</li>
        ))}
      </ul>
    </div>
  );
};
