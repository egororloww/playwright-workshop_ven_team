import classes from './index.module.scss';
import { ReactComponent as Check } from '@icons/stepper-check.svg';

export const Stepper = (): JSX.Element => {
  return (
    <div className={classes.stepper}>
      <div className={`${classes.step} ${classes.step__active}`}>
        <Check />
      </div>
      <div className={classes.line}></div>
      <div className={`${classes.step} ${classes.step__active}`}>
        <Check />
      </div>
      <div className={classes.line}></div>
      <div className={`${classes.step} ${classes.step__active}`}>3</div>
    </div>
  );
};
