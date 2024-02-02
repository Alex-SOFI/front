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
  createRoutesFromElements,
  useRoutes,
} from 'react-router-dom';

import { formatUnits } from 'ethers';
import useMagic from 'hooks/useMagic';
import { PrivateRoute, PublicRoute } from 'layout';
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
const OauthPage = lazyWithRetry(() => import('pages/OauthPage'));
const DashboardPage = lazyWithRetry(() => import('pages/DashboardPage'));
const HomePage = lazyWithRetry(() => import('pages/HomePage'));

const App = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(selectUser);

  const dispatchUser = useCallback(
    (payload: UserState) => {
      dispatch(setUser(payload));
    },
    [dispatch],
  );

  const { checkUserLoggedIn } = useMagic(window.location.pathname);

  useEffect(() => {
    checkUserLoggedIn();
  }, [checkUserLoggedIn]);

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
      <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
    ),
    [],
  );

  const routesArray = createRoutesFromElements([
    <Route key='/' path='/' element={<HomePage />} />,
    <Route
      key={routes.LOGIN}
      path={routes.LOGIN}
      element={
        <PublicRoute isLoggedIn={isLoggedIn}>
          {elementWithSuspense(<LoginPage dispatchUser={dispatchUser} />)}
        </PublicRoute>
      }
    />,
    <Route
      key={routes.EXPERT}
      path={routes.EXPERT}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn} dispatchUser={dispatchUser}>
          {elementWithSuspense(
            <ExpertPage
              tokenAddress={tokenAddress}
              refetchBalance={balance?.refetch || noop}
            />,
          )}
        </PrivateRoute>
      }
    />,
    <Route key={routes.OAUTH} path={routes.OAUTH} element={<OauthPage />} />,
    <Route key={routes.MAIN} path={routes.MAIN} element={<DashboardPage />} />,
    <Route
      key='*'
      path='*'
      element={<Navigate to={routes.EXPERT} replace />}
    />,
  ]);

  const element = useRoutes(routesArray);

  return element;
};

export default App;
