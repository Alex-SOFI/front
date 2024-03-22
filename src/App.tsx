import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  createRoutesFromElements,
  useRoutes,
} from 'react-router-dom';

import { useMagic } from 'hooks';
import { HomeRoute, PrivateRoute, PublicRoute, WalletRoute } from 'layout';
import { formatUnits } from 'viem';
import { useAccount, useConnect, useReadContracts } from 'wagmi';

import { UserState } from 'interfaces';

import addresses from 'constants/addresses';
import { tokenContract } from 'constants/contracts';
import routes from 'constants/routes';

import { selectUser } from 'ducks/user';
import { setUser } from 'ducks/user/slice';
import { selectIsMintSelected, selectIsWrongNetwork } from 'ducks/wallet';
import { storeWalletInfo } from 'ducks/wallet/slice';

import { lazyWithRetry, noop } from 'tools';
import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from 'tools/localStorageTools';

const ExpertPage = lazyWithRetry(() => import('pages/ExpertPage'));
const LoginPage = lazyWithRetry(() => import('pages/LoginPage'));
const OauthPage = lazyWithRetry(() => import('pages/OauthPage'));
const DashboardPage = lazyWithRetry(() => import('pages/DashboardPage'));
const HomePage = lazyWithRetry(() => import('pages/HomePage'));
const BuyPage = lazyWithRetry(() => import('pages/BuyPage'));
const SellPage = lazyWithRetry(() => import('pages/SellPage'));
const TransfertPage = lazyWithRetry(() => import('pages/TransfertPage'));
const SwapPage = lazyWithRetry(() => import('pages/SwapPage'));

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectUser);

  const dispatchUser = useCallback(
    (payload: UserState) => {
      dispatch(setUser(payload));
    },
    [dispatch],
  );

  useMagic(window.location.pathname);

  const isMintSelected = !!useSelector(selectIsMintSelected);

  const { address, isConnected, chain } = useAccount();
  const { error, isPending: isLoading } = useConnect();

  const tokenAddress = useMemo(
    () => (isMintSelected ? addresses.USDT : addresses.SOPHIE_TOKEN),
    [isMintSelected],
  );

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

  useEffect(() => {
    if (error) {
      removeLocalStorageItem('connectedWithWallet');
    }
    if (address && isConnected) {
      setLocalStorageItem('connectedWithWallet', 'true');
    }
  }, [address, error, isConnected]);

  const routesArray = createRoutesFromElements([
    <Route
      key={routes.HOME}
      path={routes.HOME}
      element={
        <HomeRoute>
          <HomePage />
        </HomeRoute>
      }
    />,
    <Route
      key={routes.EXPERT}
      path={routes.EXPERT}
      element={
        <WalletRoute>
          <ExpertPage
            tokenAddress={tokenAddress}
            refetchBalance={balance?.refetch || noop}
          />
        </WalletRoute>
      }
    />,
    <Route
      key={routes.LOGIN}
      path={routes.LOGIN}
      element={
        <PublicRoute isLoggedIn={isLoggedIn}>
          {<LoginPage dispatchUser={dispatchUser} />}
        </PublicRoute>
      }
    />,
    <Route key={routes.OAUTH} path={routes.OAUTH} element={<OauthPage />} />,
    <Route
      key={routes.MAIN}
      path={routes.MAIN}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <DashboardPage />
        </PrivateRoute>
      }
    />,
    <Route
      key={routes.BUY}
      path={routes.BUY}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <BuyPage />
        </PrivateRoute>
      }
    />,
    <Route
      key={routes.SELL}
      path={routes.SELL}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <SellPage />
        </PrivateRoute>
      }
    />,
    <Route
      key={routes.SWAP}
      path={routes.SWAP}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <SwapPage />
        </PrivateRoute>
      }
    />,
    <Route
      key={routes.TRANSFERT}
      path={routes.TRANSFERT}
      element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <TransfertPage />
        </PrivateRoute>
      }
    />,
    <Route key='*' path='*' element={<Navigate to={routes.HOME} replace />} />,
  ]);
  const element = useRoutes(routesArray);

  return element;
};

export default App;
