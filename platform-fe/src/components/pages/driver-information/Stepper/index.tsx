import classes from './index.module.scss';

export const Stepper = (): JSX.Element => {
  return (
    <div className={classes.stepper}>
      <div className={`${classes.step} ${classes.step__active}`}>1</div>
      <div className={classes.line}></div>
      <div className={classes.step}>2</div>
      <div className={classes.line}></div>
      <div className={classes.step}>3</div>
    </div>
  );
};
