import { ReactNode } from 'react';
import { ReactComponent as TrashIcon } from '@icons/trash.svg';
import { Modal } from '@/components';
import { useModal } from '@/components/common/Modal/useModal';
import { ModalContent } from './ModalContent';
import { CarUnavailableHoursType } from '@/services/types/cars';

export const DeleteUnavailableHours = (props: CarUnavailableHoursType): ReactNode => {
  const { modalIsOpen, openModal, closeModal } = useModal();

  return (
    <>
      <button onClick={openModal}>
        <TrashIcon />
      </button>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <ModalContent closeModal={closeModal} unavailableHours={props} />
      </Modal>
    </>
  );
};
