import { useState } from 'react';

type ReturnType = {
  modalIsOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModal = (): ReturnType => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  function openModal(): void {
    setIsOpen(true);
  }

  function closeModal(): void {
    setIsOpen(false);
  }
  return { modalIsOpen, openModal, closeModal };
};
