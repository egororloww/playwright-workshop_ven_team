import { ReactNode } from 'react';
import { ReactComponent as PdfIcon } from '@icons/admin-pdf.svg';
import classes from './index.module.scss';

type ComponentProps = {
  fileName?: string;
  fileLink?: string;
};

export const PdfView = ({ fileName, fileLink }: ComponentProps): ReactNode => {
  const name = fileName?.replace(/\.[^/.]+$/, '');

  return (
    <a download={fileName || true} href={fileLink} className={classes.link}>
      <PdfIcon />
      {name ? (
        <div className={classes.link__name}>
          <span className={classes.link__name__text}>{name.length > 10 ? name.slice(0, 10) + '...' : name}</span>
          <span className={classes.link__name__ext}>.pdf</span>
        </div>
      ) : null}
    </a>
  );
};
