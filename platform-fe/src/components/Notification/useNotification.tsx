import { useEffect, useState } from 'react';

interface ReturnType {
  notificationIsOpen: boolean;
  openNotification: () => void;
  closeNotification: () => void;
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: string) => void;
  message: string;
}

export const useNotification = (): ReturnType => {
  const [notificationIsOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  function openNotification(): void {
    setIsOpen(true);
  }

  function closeNotification(): void {
    setIsOpen(false);
  }
  function addMessage(message: string): void {
    setMessage(message);
  }
  function removeMessage(): void {
    setMessage('');
  }

  useEffect(() => {
    let timeout: number | undefined;
    if (notificationIsOpen && message) {
      timeout = setTimeout(() => {
        closeNotification();
        removeMessage();
        clearTimeout(timeout);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [notificationIsOpen, message]);

  return { notificationIsOpen, openNotification, closeNotification, message, addMessage };
};
