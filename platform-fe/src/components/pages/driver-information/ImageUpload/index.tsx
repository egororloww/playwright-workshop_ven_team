/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ReactComponent as PlusIcon } from '@icons/plus.svg';
import { ReactComponent as RemoveIcon } from '@icons/close.svg';
import classes from './index.module.scss';
import { PdfView } from './PdfView';

interface ImageUploadProps {
  onChange: (file: FileList | null) => void;
  name: string;
  error: boolean;
  helperText?: string;
  size?: 'page' | 'card';
  image?: string;
  isImageVisible?: boolean;
  onImageRemove?: () => void;
  fileName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  name,
  error,
  helperText,
  size = 'card',
  image,
  isImageVisible = true,
  onImageRemove,
  fileName,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e): void => {
        if (e.target && files[0].type === 'application/pdf') {
          setIsPdf(true);
          setPdfName(files[0].name);
        } else if (e.target) {
          setImagePreview(e.target.result as string);
        }
      };
      !!onImageRemove && !isImageVisible && onImageRemove();
      reader.readAsDataURL(files[0]);
      onChange(files);
    } else {
      setImagePreview(null);
      onChange(null);
    }
  };

  const handleRemoveImage = (): void => {
    !!onImageRemove && onImageRemove();
    setImagePreview(null);
    setPdfName(null);
    setIsPdf(false);
    onChange(null);
    const inputElement = document.getElementById(name) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  useEffect(() => {
    if ((image || fileName) && (fileName?.includes('.pdf') || image?.includes('.pdf'))) {
      setIsPdf(true);
      fileName && setPdfName(fileName);
    }
  }, [fileName, image]);

  return (
    <div className={`${classes.input} ${classes['input__' + size]}`}>
      <label className={`${classes.label} ${error ? classes.label__error : ''}`} htmlFor={name}>
        {isPdf ? (
          <PdfView fileName={pdfName || fileName} />
        ) : (imagePreview || image) && isImageVisible ? (
          <div className={classes.image}>
            <img src={imagePreview || image} alt="Preview" />
          </div>
        ) : (
          <div className={classes.upload}>
            <PlusIcon />
          </div>
        )}
      </label>
      <input id={name} type="file" accept="image/png,image/jpeg,image/jpg,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
      {((imagePreview || image) && isImageVisible) || isPdf ? (
        <button className={classes.button} type="button" onClick={handleRemoveImage}>
          <RemoveIcon />
        </button>
      ) : null}
      {error ? <span className={classes.error}>{helperText}</span> : null}
    </div>
  );
};

export default ImageUpload;
