import React, { ReactNode, Suspense, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { useAccount, useBalance, useConnect, useNetwork } from 'wagmi';

import { LoadingSpinner } from './components/basic';
import routes from './constants/routes';
import { selectIsWrongNetwork } from './ducks/wallet';
import { storeWalletInfo } from './ducks/wallet/slice';
import { lazyWithRetry } from './tools';

const ExpertPage = lazyWithRetry(() => import('./pages/ExpertPage'));

const App = () => {
  const { address, isConnected } = useAccount();
  const { error, isLoading } = useConnect();
  const { chain } = useNetwork();
  const { data } = useBalance({
    address,
  });
  const dispatch = useDispatch();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  useEffect(() => {
    dispatch(
      storeWalletInfo({
        address,
        isConnected,
        error,
        chainId: chain?.id,
        balance: isWrongNetwork ? 0 : data?.formatted || 0,
      }),
    );
  }, [
    address,
    chain?.id,
    data?.formatted,
    dispatch,
    error,
    isConnected,
    isLoading,
    isWrongNetwork,
  ]);

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
