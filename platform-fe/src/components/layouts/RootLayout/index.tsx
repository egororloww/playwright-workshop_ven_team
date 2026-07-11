import { ReactNode, Suspense, useEffect, useLayoutEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BookingForm, Loader, Modal } from '@components';
import { Outlet, useLocation } from 'react-router-dom';

import classes from './index.module.scss';
import { usePopup } from '@/context/hooks/usePopup';
import { AuthPopupContent } from '../../Modal/AuthPopupContent';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { TokensType } from '@/services/types/auth';
import { useAuth } from '@/context/hooks/useAuth';
import { useAxios } from '@/api/useAxios';

type Props = {
  children?: ReactNode;
};

export const RootLayout = ({ children }: Props): JSX.Element => {
  const { pathname } = useLocation();
  const { isPopupOpen, closePopup } = usePopup();
  const { login, setIsRefreshPending } = useAuth();
  const { api } = useAxios();

  async function refreshUser(token: TokensType): Promise<TokensType> {
    const { data }: { data: TokensType } = await api.post('/auth/refresh', token);
    return data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: refreshUser as unknown as MutationFunction<TokensType>,
    onSuccess: (data: TokensType) => {
      const { accessToken } = data;
      localStorage.setItem('accessToken', accessToken as string);
      login();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
    },
    onSettled: () => setIsRefreshPending(false),
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [pathname]);

  useLayoutEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      setIsRefreshPending(true);
      mutate({ refreshToken });
    } else {
      setIsRefreshPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className={classes.layout}>
      <BookingForm />
      <Modal modalIsOpen={isPopupOpen} closeModal={closePopup}>
        <AuthPopupContent />
      </Modal>

      <Header />
      <main className={classes.main}>
        <Suspense fallback={<Loader />}>{children ? children : <Outlet />}</Suspense>
      </main>
      <Footer />
    </div>
  );
};
