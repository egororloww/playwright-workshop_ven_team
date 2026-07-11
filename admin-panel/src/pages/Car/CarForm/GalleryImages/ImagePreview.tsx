import React, { useEffect, useState } from 'react';
import { ReactComponent as RemoveIcon } from '@icons/close_accent.svg';
import classes from './index.module.scss';
import { Typography } from '@components';

type Props = {
  onRemove?: () => void;
  imgSrc: File | string;
  error?: string;
};

const ImagePreview: React.FC<Props> = ({ onRemove, imgSrc, error = '' }) => {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!imgSrc) {
      return;
    }

    if (typeof imgSrc === 'object') {
      const image = URL.createObjectURL(imgSrc);
      setPreview(image);
    } else {
      setPreview(imgSrc);
    }
  }, [imgSrc]);
  return (
    <>
      <div className={classes.image_preview}>
        {preview ? <img src={preview} alt="Image for upload" /> : 'no-image'}
        <button className={classes.button} type="button" onClick={onRemove}>
          <RemoveIcon />
        </button>
      </div>
      {error ? (
        <Typography className={classes.field_error} size="sm" color="accent" textAlign="left" component="p">
          {error}
        </Typography>
      ) : null}
    </>
  );
};

export default ImagePreview;
