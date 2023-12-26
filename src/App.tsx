import React, { ReactNode, Suspense, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import {
  useAccount,
  useBalance,
  useConnect,
  useContractEvent,
  useNetwork,
} from 'wagmi';

import { LoadingSpinner } from './components/basic';
import { DERC20Abi } from './constants/abis';
import addresses from './constants/addresses';
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
    address: addresses.DERC20_TOKEN,
  });

  const dispatch = useDispatch();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const unwatch = useContractEvent({
    address: addresses.DERC20_TOKEN,
    abi: DERC20Abi,
    eventName: 'Approval',
    listener(log) {
      // eslint-disable-next-line no-console
      console.log(log);
    },
  });

  useEffect(() => {
    return () => unwatch?.();
  }, [unwatch]);

  useEffect(() => {
    dispatch(
      storeWalletInfo({
        address,
        isConnected,
        error,
        chainId: chain?.id,
        balance: isWrongNetwork ? 0 : data?.formatted || 0,
        decimals: isWrongNetwork ? 0 : data?.decimals || 0,
      }),
    );
  }, [
    address,
    chain?.id,
    data?.decimals,
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
        key='/'
        path='/'
        element={<Navigate to={routes.EXPERT} replace />}
      />,
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
