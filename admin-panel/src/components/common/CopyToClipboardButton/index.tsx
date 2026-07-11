import { ReactNode, useEffect, useState } from 'react';
import classes from './index.module.scss';
import { ReactComponent as CopyIcon } from '@icons/copy.svg';
import { Tooltip } from 'react-tooltip';

type ComponentProps = {
  text: string;
};

export const CopyToClipboardButton = ({ text }: ComponentProps): ReactNode => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = (): void => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setIsOpen(true);
  };

  useEffect(() => {
    let timeout: number | undefined;
    isOpen &&
      (timeout = setTimeout(() => {
        setIsOpen(false);
        clearTimeout(timeout);
      }, 1000));

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <>
      <button data-tooltip-id="my-tooltip-click" className={classes.button} onClick={copyToClipboard}>
        <CopyIcon />
      </button>
      <Tooltip className={classes.tooltip} id="my-tooltip-click" isOpen={isOpen} content="Copied to clipboard!" openOnClick={true} />
    </>
  );
};
