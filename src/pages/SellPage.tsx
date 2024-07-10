import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDecimals, useMagic } from 'hooks';
import { Address, encodeFunctionData, formatUnits, parseUnits } from 'viem';
import { arbitrum, polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import { publicClient, tokenContract } from 'constants/contracts';
import routes from 'constants/routes';
import sophieAbi from 'constants/sophieAbi';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { SellPageMain } from 'components/pagesComponents/sellPage';

import { Layout } from 'components';
import { LoadingSpinner } from 'components/basic';

const SellPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>('');

  const [balance, setBalance] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);

  const [isTransactionError, setIsTransactionError] = useState<boolean>(false);

  const [transactionErrorText, setTransactionErrorText] = useState<string>('');

  useEffect(() => {
    if (Number(inputValue) > Number(balance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [inputValue, balance]);

  const decimals = useDecimals(addresses.SOPHIE_TOKEN);

  useEffect(() => {
    const getBalance = async () => {
      const result = await publicClient.readContract({
        ...tokenContract(addresses.SOPHIE_TOKEN),
        functionName: 'balanceOf',
        args: [magicLinkAddress as Address],
      });
      setBalance(formatUnits(result as bigint, decimals!));
    };
    getBalance();
  }, [magicLinkAddress, isTransactionLoading, decimals]);

  const handleInvestInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setInputValue, decimals!);
      setIsTransactionError(false);
    },
    [decimals],
  );
  const { walletClient } = useMagic(window.location.pathname);

  const handleSellButtonClick = useCallback(async () => {
    setIsTransactionLoading(true);
    const hash = await walletClient
      ?.sendTransaction({
        account: magicLinkAddress,
        chain: import.meta.env.VITE_ENV === 'staging' ? polygonMumbai : arbitrum,
        to: addresses.TOKEN_MANAGER,
        data: encodeFunctionData({
          abi: sophieAbi,
          functionName: 'redeem',
          args: [parseUnits(inputValue, decimals!)],
        }),
      })
      .catch((error) => {
        setIsTransactionLoading(false);
        setIsTransactionError(true);
        setTransactionErrorText(error?.details);
      });
    if (hash) {
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (transaction.status === 'success') {
        setIsTransactionLoading(false);
        setIsTransactionError(false);
      }

      navigate(routes.MAIN);
    }
  }, [decimals, inputValue, magicLinkAddress, navigate, walletClient]);

  const setMaxValue = useCallback(() => {
    setInputValue(balance!);
  }, [balance]);

  return (
    <>
      <Layout
        alwaysShowMarketingClaim
        main={
          !balance ? (
            <LoadingSpinner position='relative' />
          ) : (
            <SellPageMain
              handleButtonClick={handleSellButtonClick}
              inputValue={inputValue}
              handleInputChange={handleInvestInputChange}
              balance={Number(balance)}
              setMaxValue={setMaxValue}
              isMaxValueError={isMaxValueError}
              isTransactionLoading={isTransactionLoading}
              isTransactionError={isTransactionError}
              transactionErrorText={transactionErrorText}
            />
          )
        }
      />
    </>
  );
};

export default SellPage;
