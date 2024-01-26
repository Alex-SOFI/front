import React, {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
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
import { checkUser } from 'service/magic';
import { useAccount, useConnect, useReadContracts } from 'wagmi';

import { UserState } from 'interfaces';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import { tokenContract } from 'constants/contracts';
import routes from 'constants/routes';

import { selectUser } from 'ducks/user';
import { setUser } from 'ducks/user/slice';
import { selectIsMintSelected, selectIsWrongNetwork } from 'ducks/wallet';
import { storeWalletInfo } from 'ducks/wallet/slice';

import { lazyWithRetry, noop } from 'tools';

import { LoadingSpinner } from 'components/basic';

const ExpertPage = lazyWithRetry(() => import('pages/ExpertPage'));
const LoginPage = lazyWithRetry(() => import('pages/LoginPage'));

const App = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(selectUser);

  const dispatchUser = useCallback(
    (payload: UserState) => {
      dispatch(setUser(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    const validateUser = async () => {
      try {
        await checkUser(dispatchUser);
        return null;
      } catch (error) {
        console.error(error);
      }
    };
    validateUser();
  }, [dispatchUser, isLoggedIn]);

  const isMintSelected = !!useSelector(selectIsMintSelected);

  const { address, isConnected, chain } = useAccount();
  const { error, isPending: isLoading } = useConnect();

  const tokenAddress = useMemo(() => {
    if (isMintSelected) {
      return chain?.id === chainIds.TESTNET
        ? addresses.USDC_MUMBAI
        : addresses.USDC;
    } else {
      return addresses.SOFI_TOKEN;
    }
  }, [chain?.id, isMintSelected]);

  const balance = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        ...tokenContract(tokenAddress),
        functionName: 'balanceOf',
        args: [address || '0x'],
      },
      {
        ...tokenContract(tokenAddress),
        functionName: 'decimals',
      },
      {
        ...tokenContract(tokenAddress),
        functionName: 'symbol',
      },
    ],
  });

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
      <Suspense fallback={<LoadingSpinner />}>
        {isLoggedIn === null ? <LoadingSpinner /> : element}
      </Suspense>
    ),
    [isLoggedIn],
  );

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        key='/'
        path='/'
        element={<Navigate to={routes.EXPERT} replace />}
      />,
      <Route
        key={routes.LOGIN}
        path={routes.LOGIN}
        element={elementWithSuspense(<LoginPage dispatchUser={dispatchUser} />)}
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

  return (
    <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
  );
};

export default App;
