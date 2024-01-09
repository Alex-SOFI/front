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

import { erc20Abi, formatUnits } from 'viem';
import {
  useAccount,
  useConnect,
  useReadContracts,
  useWatchContractEvent,
} from 'wagmi';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import routes from 'constants/routes';

import { selectIsWrongNetwork } from 'ducks/wallet';
import { storeWalletInfo } from 'ducks/wallet/slice';

import { lazyWithRetry } from 'tools';

import { LoadingSpinner } from 'components/basic';

const ExpertPage = lazyWithRetry(() => import('pages/ExpertPage'));
const App = () => {
  const { address, isConnected, chain } = useAccount();
  const { error, isPending: isLoading } = useConnect();

  const tokenAddress = useMemo(
    () =>
      chain?.id === chainIds.TESTNET ? addresses.USDC_MUMBAI : addresses.USDC,
    [chain?.id],
  );

  const balance = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address || '0x'],
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ],
  });

  const dispatch = useDispatch();

  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  /* const [owner, setOwner] = useState<`0x${string}`>('' as `0x${string}`);
  const [spender, setSpender] = useState<`0x${string}`>('' as `0x${string}`); */

  const unwatch = useWatchContractEvent({
    address: tokenAddress,
    abi: erc20Abi,
    eventName: 'Approval',
    onLogs(logs) {
      // eslint-disable-next-line no-console
      console.log(logs);
      /* setOwner(log[0]?.args.owner as `0x${string}`);
      setSpender(log[0]?.args.spender as `0x${string}`); */
    },
  });

  /* const allowance = useContractRead({
    address: addresses.USDC,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner, spender],
  }); */

  useEffect(() => {
    return () => unwatch;
  }, [unwatch]);

  useEffect(() => {
    dispatch(
      storeWalletInfo({
        address,
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
