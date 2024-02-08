import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  createRoutesFromElements,
  useRoutes,
} from 'react-router-dom';

import { formatUnits } from 'ethers';
import { useHasWallet, useMagic } from 'hooks';
import { HomeRoute, PrivateRoute, PublicRoute, WalletRoute } from 'layout';
import { Address } from 'viem';
import { useAccount, useConnect, useReadContracts } from 'wagmi';

import { UserState } from 'interfaces';

import addresses from 'constants/addresses';
import chainIds from 'constants/chainIds';
import { tokenContract } from 'constants/contracts';
import routes from 'constants/routes';

import { selectUser } from 'ducks/user';
import { setUser } from 'ducks/user/slice';
import { selectIsMintSelected, selectIsWrongNetwork } from 'ducks/wallet';
import { storeMagicLinkAddress, storeWalletInfo } from 'ducks/wallet/slice';

import { lazyWithRetry, noop } from 'tools';

const ExpertPage = lazyWithRetry(() => import('pages/ExpertPage'));
const LoginPage = lazyWithRetry(() => import('pages/LoginPage'));
const OauthPage = lazyWithRetry(() => import('pages/OauthPage'));
const DashboardPage = lazyWithRetry(() => import('pages/DashboardPage'));
const HomePage = lazyWithRetry(() => import('pages/HomePage'));
const BuyPage = lazyWithRetry(() => import('pages/BuyPage'));

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectUser);
  const userHasWallet = useHasWallet();
  const { provider } = useMagic(window.location.pathname);

  const getAddress = useCallback(async () => {
    return provider?.getSigner().then((signer) => {
      dispatch(storeMagicLinkAddress(signer.address as Address));
    });
  }, [dispatch, provider]);

  useEffect(() => {
    if (isLoggedIn && !userHasWallet) {
      getAddress();
    }
  }, [getAddress, isLoggedIn, userHasWallet]);

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
        /* <PrivateRoute isLoggedIn={isLoggedIn}> */
        <BuyPage />
        /* </PrivateRoute> */
      }
    />,
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
