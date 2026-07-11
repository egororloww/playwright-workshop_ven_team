import { ReactNode } from 'react';
import classes from './index.module.scss';
import { Modal, PageWrapper } from '@/components';
import { AccentButton, Container } from '@/components';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useModal } from '@/components/Modal/useModal';
import { ChangePassword } from './ChangePassword';

export const ProfileLayout = (): ReactNode => {
  const { pathname } = useLocation();
  const { modalIsOpen, openModal, closeModal } = useModal();

  return (
    <PageWrapper>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <ChangePassword closeModal={closeModal} />
      </Modal>
      <Container>
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <h1 className={classes.title}>Profile</h1>
            {pathname === '/profile' ? (
              <div className={classes.actions}>
                <AccentButton textUppercase={true} textWeight="700" component={Link} to="edit">
                  Edit Profile
                </AccentButton>
                <AccentButton onClick={openModal} textUppercase={true} textWeight="700">
                  Change Password
                </AccentButton>
              </div>
            ) : null}
          </div>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
