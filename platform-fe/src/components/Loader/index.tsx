import classes from './index.module.scss';

export const Loader = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <span className={classes.loader}></span>
    </div>
  );
};
