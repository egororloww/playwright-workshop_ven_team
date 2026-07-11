import ReactModal from 'react-modal';
import { ReactComponent as Close } from '@icons/close.svg';
import { PropsWithChildren } from 'react';

import classes from './index.module.scss';

type ModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
};

export const Modal = ({ modalIsOpen, closeModal, children }: PropsWithChildren<ModalProps>): JSX.Element => {
  return (
    <ReactModal
      preventScroll={true}
      className={classes.modal}
      overlayClassName={classes.backdrop}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
    >
      <button onClick={closeModal} className={classes.close}>
        <Close />
      </button>
      {children}
    </ReactModal>
  );
};
