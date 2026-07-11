import { useState } from 'react';

type ReturnType = {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
};

export const useDrawer = (): ReturnType => {
  const [open, setOpen] = useState(false);
  const handleClose = (): void => setOpen(false);
  const handleOpen = (): void => setOpen(true);

  return { open, handleClose, handleOpen };
};
