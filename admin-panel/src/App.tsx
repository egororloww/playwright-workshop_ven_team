/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ReactModal from 'react-modal';
import { Suspense, useLayoutEffect } from 'react';
import useRefreshMutation from './services/mutations/useRefreshMutation';
import { useAuth } from './context/hooks/useAuth';
import { Loader } from './components';

ReactModal.setAppElement('#root');

function App(): JSX.Element {
  const { setIsRefreshPending } = useAuth();
  const { refreshMutation } = useRefreshMutation();
  useLayoutEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      setIsRefreshPending(true);
      refreshMutation({ refreshToken });
    } else {
      setIsRefreshPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
