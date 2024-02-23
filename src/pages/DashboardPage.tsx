import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useMagic } from 'hooks';
import { Address, formatUnits } from 'viem';

import addresses from 'constants/addresses';
import {
  contractInstance,
  publicClient,
  tokenContract,
} from 'constants/contracts';
import routes from 'constants/routes';

import {
  getBalanceValue,
  resetBalanceValue,
  selectBalanceValue,
} from 'ducks/balanceValue';
import { selectWalletInfo } from 'ducks/wallet';
import { resetMagicLinkBalance, setMagicLinkBalance } from 'ducks/wallet/slice';

import { DashboardPageMain } from 'components/pagesComponents/dashboardPage';

import { Layout } from 'components';
import { LoadingSpinner } from 'components/basic';

const DashboardPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { magicLinkAddress, magicLinkBalance, isMagicLinkBalanceSet } =
    useSelector(selectWalletInfo);

  const { isLoading, sofiValue, usdcValue, maticValue } =
    useSelector(selectBalanceValue);

  const navigateToBuyPage = useCallback(() => {
    navigate(routes.BUY);
  }, [navigate]);

  const { walletClient } = useMagic(window.location.pathname);

  const contract = useMemo(() => {
    if (walletClient) {
      return contractInstance(
        '0x0c86A754A29714C4Fe9C6F1359fa7099eD174c0b',
        walletClient,
      );
    }
  }, [walletClient]);

  useEffect(() => {
    const getBalance = async () => {
      /* if (contract) { */
      const results = await publicClient.multicall({
        contracts: [
          {
            ...tokenContract(addresses.SOFI_TOKEN),
            functionName: 'balanceOf',
            args: [magicLinkAddress as Address],
          },
          {
            ...tokenContract(addresses.USDC_MUMBAI),
            functionName: 'balanceOf',
            args: [magicLinkAddress as Address],
          },
          {
            ...tokenContract(addresses.MATIC),
            functionName: 'balanceOf',
            args: [magicLinkAddress as Address],
          },
        ],
      });
      dispatch(
        setMagicLinkBalance({
          ...(results[0].status === 'success' &&
            results[0].result !== 0n && {
              SOFI: formatUnits(results[0].result as bigint, 18),
            }),
          ...(results[1].status === 'success' &&
            results[1].result !== 0n && {
              USDC: formatUnits(results[1].result as bigint, 18),
            }),
          ...(results[2].status === 'success' &&
            results[2].result !== 0n && {
              MATIC: formatUnits(results[2].result as bigint, 18),
            }),
        }),
      );
      /* } */
    };
    getBalance();
  }, [contract, dispatch, magicLinkAddress]);

  useEffect(() => {
    if (
      isMagicLinkBalanceSet &&
      (magicLinkBalance?.SOFI ||
        magicLinkBalance?.USDC ||
        magicLinkBalance?.MATIC)
    ) {
      dispatch(
        getBalanceValue({
          ...(magicLinkBalance?.SOFI && { SOFI: magicLinkBalance?.SOFI }),
          ...(magicLinkBalance?.USDC && { USDC: magicLinkBalance?.USDC }),
          ...(magicLinkBalance?.MATIC && { MATIC: magicLinkBalance?.MATIC }),
        }),
      );
    }
  }, [
    dispatch,
    isMagicLinkBalanceSet,
    magicLinkBalance?.MATIC,
    magicLinkBalance?.SOFI,
    magicLinkBalance?.USDC,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetMagicLinkBalance());
      dispatch(resetBalanceValue());
    };
  }, [dispatch]);

  return (
    <Layout
      main={
        isMagicLinkBalanceSet && !isLoading ? (
          <DashboardPageMain
            balance={magicLinkBalance}
            balanceValue={{
              SOFI: sofiValue,
              USDC: usdcValue,
              MATIC: maticValue,
            }}
            navigateToBuyPage={navigateToBuyPage}
          />
        ) : (
          <LoadingSpinner position='relative' />
        )
      }
    />
  );
};

export default DashboardPage;
