import React, { useEffect, useState } from 'react';
import { ReactComponent as PlusIcon } from '@icons/plus.svg';
import { ReactComponent as RemoveIcon } from '@icons/close_accent.svg';
import classes from './index.module.scss';
import { Typography } from '@components';

interface ImageUploadProps {
  onChange: (file: FileList | undefined) => void;
  name: string;
  error?: boolean;
  helperText?: string;
  size?: 'page' | 'card';
  image?: string | FileList;
  label?: string;
  isImageVisible?: boolean;
  asUpload?: boolean;
  onImageRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  name,
  error = false,
  size = 'card',
  image,
  isImageVisible = true,
  onImageRemove,
  label,
  asUpload = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(files);
      if (asUpload) {
        handleRemoveImage();
      }
    } else {
      setImagePreview(null);
      onChange(undefined);
    }
  };

  const handleRemoveImage = (): void => {
    !!onImageRemove && onImageRemove();
    setImagePreview(null);
    onChange(undefined);
    const inputElement = document.getElementById(name) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  useEffect(() => {
    if (!image) {
      return;
    }

    const preview = typeof image === 'object' ? URL.createObjectURL(image[0]) : image;

    setImagePreview(preview);

    return () => URL.revokeObjectURL(preview);
  }, [image]);

  return (
    <div>
      {label && (
        <Typography className={classes.listing_images_title} color="dark-080" textAlign="left" textWeight="400" component="p">
          {label}
        </Typography>
      )}
      <div className={`${classes.input} ${classes['input__' + size]}`}>
        <label className={`${classes.label} ${error ? classes.label__error : ''}`} htmlFor={name}>
          {imagePreview && isImageVisible ? (
            <div className={classes.image}>
              <img src={imagePreview} alt="Preview" />
            </div>
          ) : (
            <div className={classes.upload}>
              <PlusIcon />
            </div>
          )}
        </label>
        <input id={name} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        {imagePreview && isImageVisible ? (
          <button className={classes.button} type="button" onClick={handleRemoveImage}>
            <RemoveIcon />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ImageUpload;
