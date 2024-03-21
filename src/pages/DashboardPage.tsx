import { FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDecimals, useIsMobile } from 'hooks';
import { Address, formatUnits } from 'viem';

import addresses from 'constants/addresses';
import { publicClient, tokenContract } from 'constants/contracts';
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

  const isMobile = useIsMobile();

  const { magicLinkAddress, magicLinkBalance, isMagicLinkBalanceSet } =
    useSelector(selectWalletInfo);

  const { isLoading, sophieValue, usdtValue, maticValue } =
    useSelector(selectBalanceValue);

  const navigateToBuyPage = useCallback(() => {
    navigate(routes.BUY);
  }, [navigate]);

  const navigateToSellPage = useCallback(() => {
    navigate(routes.SELL);
  }, [navigate]);

  const usdtDecimals = useDecimals(addresses.USDT);
  const sophieDecimals = useDecimals(addresses.SOPHIE_TOKEN);
  const maticDecimals = useDecimals(addresses.MATIC);

  useEffect(() => {
    const getBalance = async () => {
      const results = await publicClient.multicall({
        contracts: [
          {
            ...tokenContract(addresses.SOPHIE_TOKEN),
            functionName: 'balanceOf',
            args: [magicLinkAddress as Address],
          },
          {
            ...tokenContract(addresses.USDT),
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
              SOPHIE: Number(
                formatUnits(results[0].result as bigint, sophieDecimals!),
              ),
            }),
          ...(results[1].status === 'success' &&
            results[1].result !== 0n && {
              USDT: Number(
                formatUnits(results[1].result as bigint, usdtDecimals!),
              ),
            }),
          ...(results[2].status === 'success' &&
            results[2].result !== 0n && {
              MATIC: Number(
                formatUnits(results[2].result as bigint, maticDecimals!),
              ),
            }),
        }),
      );
    };
    getBalance();
  }, [dispatch, magicLinkAddress, maticDecimals, sophieDecimals, usdtDecimals]);

  useEffect(() => {
    if (
      isMagicLinkBalanceSet &&
      (magicLinkBalance?.SOPHIE ||
        magicLinkBalance?.USDT ||
        magicLinkBalance?.MATIC)
    ) {
      dispatch(
        getBalanceValue({
          ...(magicLinkBalance?.SOPHIE && { SOPHIE: magicLinkBalance?.SOPHIE }),
          ...(magicLinkBalance?.USDT && { USDT: magicLinkBalance?.USDT }),
          ...(magicLinkBalance?.MATIC && { MATIC: magicLinkBalance?.MATIC }),
        }),
      );
    }
  }, [
    dispatch,
    isMagicLinkBalanceSet,
    magicLinkBalance?.MATIC,
    magicLinkBalance?.SOPHIE,
    magicLinkBalance?.USDT,
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
              SOPHIE: sophieValue,
              USDT: usdtValue,
              MATIC: maticValue,
            }}
            navigateToBuyPage={navigateToBuyPage}
            navigateToSellPage={navigateToSellPage}
            isMobile={isMobile}
          />
        ) : (
          <LoadingSpinner position='relative' />
        )
      }
    />
  );
};

export default DashboardPage;
