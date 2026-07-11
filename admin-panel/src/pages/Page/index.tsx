import classes from './index.module.scss';

type ComponentProps = {
  props: null;
};

export const Page = ({ props }: ComponentProps): JSX.Element => {
  return (
    <>
      <h1 className={classes.title}>React TS FC Component {props}</h1>
    </>
  );
};
