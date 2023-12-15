import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { useAccount, useConnect } from 'wagmi';

import routes from './constants/routes';
import { storeWalletInfo } from './ducks/wallet/slice';
import { lazyWithRetry } from './tools';

const ExpertPage = lazyWithRetry(() => import('./pages/ExpertPage'));

const App = () => {
  const { address, isConnected } = useAccount();
  const { error, isLoading } = useConnect();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(storeWalletInfo({ address, isConnected, error, isLoading }));
  }, [address, dispatch, error, isConnected, isLoading]);

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        key={routes.EXPERT}
        path={routes.EXPERT}
        element={<ExpertPage /* connect={connect} */ />}
      />,
      <Route
        key='*'
        path='*'
        element={<Navigate to={routes.EXPERT} replace />}
      />,
    ]),
  );

  return <RouterProvider router={router} />;
};

export default App;
