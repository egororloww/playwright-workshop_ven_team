import { createBrowserRouter } from 'react-router-dom';
import {
  AboutUs,
  BookingDetails,
  BookingTermsAndConditions,
  CarDetails,
  DriverInformation,
  EditProfile,
  ErrorPage,
  Landing,
  MyBookings,
  NotFound,
  OurCars,
  Payment,
  PrivacyPolicy,
  Profile,
  SuccessPayment,
  TermsAndConditions,
} from '@/pages';
import {
  RootLayout,
  ProfileLayout,
  BookingLayout,
  // PaymentContentTest
} from '@/components';
import { Winners } from '@/pages/Winners';
import { PrivateRoute } from './PrivateRoute';
import { FAQPage } from '@/pages/FAQPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component(): JSX.Element {
      return <RootLayout />;
    },
    errorElement: (
      <RootLayout>
        <ErrorPage />
      </RootLayout>
    ),
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '*',
        element: <NotFound />,
      },

      {
        path: 'our-cars',
        children: [
          { index: true, element: <OurCars /> },
          {
            path: ':id',
            element: <CarDetails />,
          },
        ],
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditions />,
      },
      {
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'booking',
        element: <BookingLayout />,
        children: [
          {
            index: true,
            element: <DriverInformation />,
          },
          {
            path: 'terms-and-conditions',
            element: (
              <PrivateRoute>
                <BookingTermsAndConditions />
              </PrivateRoute>
            ),
          },
          {
            path: 'payment',
            element: (
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            ),
          },
        ],
      },
      // {
      //   path: 'booking/payment/test',
      //   element: <PaymentContentTest />,
      // },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <ProfileLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: 'edit',
            element: <EditProfile />,
          },
        ],
      },
      {
        path: 'booking/payment/:id',
        element: <SuccessPayment />,
      },
      {
        path: 'booking/list',
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: 'booking/:id',
        element: <BookingDetails />,
      },
      {
        path: 'winners',
        element: <Winners />,
      },
    ],
  },
]);
