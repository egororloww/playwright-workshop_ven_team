import { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { ReactComponent as DotsIcon } from '@icons/dots.svg';
import { ReactComponent as CompleteIcon } from '@icons/complete.svg';
import { ReactComponent as AcceptIcon } from '@icons/accept.svg';
import { ReactComponent as DeclineIcon } from '@icons/decline.svg';

import { ControlledMenu, MenuItem, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import classes from './index.module.scss';
import { Modal, Typography } from '@/components';
import { useStatusChange } from '@/services/fetchers/useStatusChange';
import { useModal } from '@/components/common/Modal/useModal';
import { ModalContent } from './ModalContent';

type ComponentProps = {
  status: string;
  bookingId: string;
  userId: number;
};

export const ActionsMenu = ({ status, bookingId, userId }: ComponentProps): ReactNode => {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const anchorProps = useClick(isOpen, setOpen);

  const handleClose = (): void => setOpen(false);

  const { handleChangeStatusMutation, isStatusPending } = useStatusChange({ bookingId, userId, handleAction: handleClose });
  const { modalIsOpen, openModal, closeModal } = useModal();

  if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'declined' || status.toLowerCase() === 'canceled') {
    return null;
  }
  return (
    <>
      <button type="button" ref={ref} {...anchorProps} className={classes.button}>
        <DotsIcon />
      </button>
      <ControlledMenu className={classes.menu} state={isOpen ? 'open' : 'closed'} anchorRef={ref} onClose={handleClose} transition>
        {status.toLowerCase() === 'new' ? (
          <MenuItem
            className={`${classes.menu__item} ${isStatusPending ? classes.menu__item_disabled : ''}`}
            onClick={(e) => {
              e.stopPropagation = true;
              e.keepOpen = true;
              handleChangeStatusMutation('accepted');
            }}
          >
            <AcceptIcon />
            <Typography size="md" textWeight="500" color="dark-080">
              Accept
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem
            className={`${classes.menu__item} ${isStatusPending ? classes.menu__item_disabled : ''}`}
            onClick={(e) => {
              e.stopPropagation = true;
              e.keepOpen = true;
              handleChangeStatusMutation('completed');
            }}
          >
            <CompleteIcon />
            <Typography size="md" textWeight="500" color="dark-080">
              Complete
            </Typography>
          </MenuItem>
        )}

        <MenuItem className={`${classes.menu__item} ${isStatusPending ? classes.menu__item_disabled : ''}`} onClick={openModal}>
          <DeclineIcon />
          <Typography size="md" textWeight="500" color="dark-080">
            Decline
          </Typography>
        </MenuItem>
      </ControlledMenu>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <ModalContent closeModal={closeModal} bookingId={bookingId} userId={userId} />
      </Modal>
    </>
  );
};
