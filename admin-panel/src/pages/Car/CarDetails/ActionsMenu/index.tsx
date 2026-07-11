import { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { ReactComponent as DotsIcon } from '@icons/dots.svg';
import { ReactComponent as DeleteIcon } from '@icons/trash.svg';
import { ReactComponent as EditIcon } from '@icons/pencil.svg';

import { ControlledMenu, MenuItem, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import classes from './index.module.scss';
import { Modal, Typography } from '@/components';
import { useModal } from '@/components/common/Modal/useModal';
import ModalContent from './ModalContent';
import { useNavigate } from 'react-router-dom';

type ComponentProps = {
  carName: string;
  carId?: number | string;
};

const ActionsMenu = ({ carId, carName }: ComponentProps): ReactNode => {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const anchorProps = useClick(isOpen, setOpen);

  const navigate = useNavigate();

  const handleClose = (): void => setOpen(false);

  const { modalIsOpen, openModal, closeModal } = useModal();

  return (
    <>
      <button type="button" ref={ref} {...anchorProps} className={classes.button}>
        <DotsIcon />
      </button>
      <ControlledMenu className={classes.menu} state={isOpen ? 'open' : 'closed'} anchorRef={ref} onClose={handleClose} transition>
        <MenuItem className={`${classes.menu__item}`} onClick={() => navigate(`/cars/edit/${carId}`)}>
          <EditIcon />
          <Typography size="md" textWeight="500" color="dark-080">
            Edit car
          </Typography>
        </MenuItem>

        <MenuItem className={`${classes.menu__item}`} onClick={openModal}>
          <DeleteIcon />
          <Typography size="md" textWeight="500" color="dark-080">
            Delete car
          </Typography>
        </MenuItem>
      </ControlledMenu>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <ModalContent closeModal={closeModal} carName={carName} carId={carId} />
      </Modal>
    </>
  );
};

export default ActionsMenu;
