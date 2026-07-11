import classes from './index.module.scss';
import { ReactComponent as PrevIcon } from '@icons/chevron-left.svg';
import { ReactComponent as NextIcon } from '@icons/chevron-right.svg';

type Props = {
  url: string | undefined;
  handleNextModalImage: (arg: number) => void;
  handlePrevModalImage: (arg: number) => void;
  index: number;
};

export const Gallery = ({ url, handleNextModalImage, handlePrevModalImage, index }: Props): JSX.Element => (
  <div className={classes.modal}>
    <button className={`${classes.button} ${classes.button__prev}`} onClick={() => handlePrevModalImage(index)}>
      <PrevIcon />
    </button>
    <img src={url} alt="image" />
    <button className={`${classes.button} ${classes.button__next}`} onClick={() => handleNextModalImage(index)}>
      <NextIcon />
    </button>
  </div>
);
