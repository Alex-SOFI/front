import React, { ReactNode, Suspense, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { useAccount, useConnect, useNetwork } from 'wagmi';

import { LoadingSpinner } from './components/basic';
import routes from './constants/routes';
import { storeWalletInfo } from './ducks/wallet/slice';
import { lazyWithRetry } from './tools';

const ExpertPage = lazyWithRetry(() => import('./pages/ExpertPage'));

const App = () => {
  const { address, isConnected } = useAccount();
  const { error, isLoading } = useConnect();
  const { chain } = useNetwork();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      storeWalletInfo({ address, isConnected, error, chainId: chain?.id }),
    );
  }, [address, chain?.id, dispatch, error, isConnected, isLoading]);

  const elementWithSuspense = useCallback(
    (element: ReactNode) => (
      <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
    ),
    [],
  );

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        key={routes.EXPERT}
        path={routes.EXPERT}
        element={elementWithSuspense(<ExpertPage />)}
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
