import React, {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  /* useState, */
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { formatUnits } from 'ethers';
import { erc20Abi } from 'viem';
import { useAccount, useConnect, useReadContracts } from 'wagmi';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import routes from 'constants/routes';

import { selectIsMintSelected, selectIsWrongNetwork } from 'ducks/wallet';
import { storeWalletInfo } from 'ducks/wallet/slice';

import { lazyWithRetry, noop } from 'tools';

import { LoadingSpinner } from 'components/basic';

const ExpertPage = lazyWithRetry(() => import('pages/ExpertPage'));

const App = () => {
  const isMintSelected = !!useSelector(selectIsMintSelected);

  const { address, isConnected, chain } = useAccount();
  const { error, isPending: isLoading } = useConnect();

  const tokenAddress = useMemo(
    () =>
      chain?.id === chainIds.TESTNET ? addresses.USDC_MUMBAI : addresses.USDC,
    [chain?.id],
  );

  const contract = useMemo(
    () => ({
      address: isMintSelected ? tokenAddress : addresses.SOFI_TOKEN,
      abi: erc20Abi,
    }),
    [isMintSelected, tokenAddress],
  );

  const balance = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        ...contract,
        functionName: 'balanceOf',
        args: [address || '0x'],
      },
      {
        ...contract,
        functionName: 'decimals',
      },
      {
        ...contract,
        functionName: 'symbol',
      },
    ],
  });

  const dispatch = useDispatch();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  useEffect(() => {
    dispatch(
      storeWalletInfo({
        address: address || '0x',
        isConnected,
        error,
        chainId: chain?.id,
        balance:
          !isConnected || isWrongNetwork
            ? '0'
            : balance?.data
              ? formatUnits(balance?.data?.[0], balance?.data?.[1])
              : '0',
        decimals: isWrongNetwork ? 0 : balance?.data?.[1] || 0,
      }),
    );
  }, [
    address,
    balance?.data,
    chain?.id,
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
        element={elementWithSuspense(
          <ExpertPage
            tokenAddress={tokenAddress}
            refetchBalance={balance?.refetch || noop}
          />,
        )}
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
