import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components';
import { PrivateRoute } from './PrivateRoute';

import { BookingInfo, Bookings, Car, CarAvailability, CarDetails, CarForm, Cars, Customer, CustomerBookings, CustomerInfo, Customers, Raffle } from '@/pages';


export const router = createBrowserRouter([
  {
    path: '/',
    Component(): JSX.Element {
      return (
        <PrivateRoute>
          <RootLayout />
        </PrivateRoute>
      );
    },
    children: [
      {
        index: true,
        Component(): JSX.Element {
          return <Navigate to="cars" replace />;
        },
      },
      {
        path: 'cars',
        children: [
          { index: true, element: <Cars /> },
          {
            path: ':id',
            element: <Car />,
            children: [
              { index: true, element: <CarDetails /> },
              { path: 'availability', element: <CarAvailability /> },
            ],
          },
          {
            path: 'create',
            element: <CarForm />,
          },
          {
            path: 'edit',
            children: [
              {
                path: ':id',
                element: <CarForm />,
              },
            ],
          },
        ],
      },
      {
        path: 'bookings',
        children: [
          { index: true, element: <Bookings /> },
          {
            path: ':id',
            element: <BookingInfo />,
          },
        ],
      },
      {
        path: 'customers',
        children: [
          { index: true, element: <Customers /> },
          {
            path: ':id',
            element: <Customer />,
            children: [
              { index: true, element: <CustomerInfo /> },
              { path: 'bookings', element: <CustomerBookings /> },
            ],
          },
        ],
      },
      {
        path: 'raffle',
        children: [{ index: true, element: <Raffle /> }],
      },
    ],
  },
]);
