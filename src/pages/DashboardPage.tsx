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

import { selectWalletInfo } from 'ducks/wallet';
import { resetMagicLinkBalance, setMagicLinkBalance } from 'ducks/wallet/slice';

import { DashboardPageMain } from 'components/pagesComponents/dashboardPage';

import { Layout } from 'components';
import { LoadingSpinner } from 'components/basic';

const DashboardPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { magicLinkAddress, /* magicLinkBalance, */ isMagicLinkBalanceSet } =
    useSelector(selectWalletInfo);

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
      if (contract) {
        const results = await publicClient.multicall({
          contracts: [
            {
              ...contract,
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
            SOFI:
              results[0].status === 'success'
                ? formatUnits(results[0].result as bigint, 18)
                : null,
            USDC:
              results[1].status === 'success'
                ? formatUnits(results[1].result as bigint, 18)
                : null,
            MATIC:
              results[2].status === 'success'
                ? formatUnits(results[2].result as bigint, 18)
                : null,
          }),
        );
      }
    };
    getBalance();
  }, [contract, dispatch, magicLinkAddress]);

  useEffect(() => {
    return () => {
      dispatch(resetMagicLinkBalance());
    };
  }, [dispatch]);

  return (
    <Layout
      main={
        isMagicLinkBalanceSet ? (
          <DashboardPageMain
            balance={null}
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
