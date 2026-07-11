import { ReactComponent as FileIcon } from '@icons/pdf-icon.svg';
import { ReactNode } from 'react';
import classes from './index.module.scss';

type PdfViewProps = {
  fileName: string | undefined;
};

export const PdfView = ({ fileName }: PdfViewProps): ReactNode => {
  const name = fileName?.replace(/\.[^/.]+$/, '');
  return (
    <div className={classes.card}>
      <div className={classes.card__icon}>
        <FileIcon />
      </div>
      {name ? (
        <div className={classes.card__name}>
          <span className={classes.card__name__text}>{name.length > 17 ? name.slice(0, 17) + '...' : name}</span>
          <span className={classes.card__name__ext}>.pdf</span>
        </div>
      ) : null}
    </div>
  );
};
