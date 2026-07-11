import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DrawerProvider } from '@context/DrawerContext';
import { BookingProvider } from '@context/BookingContext';
import { AuthProvider } from '@/context/AuthContext';
import { PopupProvider } from '@/context/PopupContext';

import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PopupProvider>
        <DrawerProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </DrawerProvider>
      </PopupProvider>
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
