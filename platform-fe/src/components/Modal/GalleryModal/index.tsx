import ReactModal from 'react-modal';
import ReactDOM from 'react-dom';

import { ReactComponent as Close } from '@icons/close.svg';
import { PropsWithChildren } from 'react';

import classes from './index.module.scss';

type ModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
};

export const GalleryModal = ({ modalIsOpen, closeModal, children }: PropsWithChildren<ModalProps>): JSX.Element => {
  return (
    <>
      <ReactModal className={classes.modal} overlayClassName={classes.backdrop} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal">
        {children}
      </ReactModal>
      {modalIsOpen &&
        ReactDOM.createPortal(
          <button onClick={closeModal} className={classes.close}>
            <Close />
          </button>,
          document.body
        )}
    </>
  );
};
