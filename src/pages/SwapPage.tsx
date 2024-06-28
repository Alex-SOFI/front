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
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  parseUnits,
} from 'viem';
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

const SwapPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>('');

  const [balance, setBalance] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);

  const [isTransactionError, setIsTransactionError] = useState<boolean>(false);

  const [transactionErrorText, setTransactionErrorText] = useState<string>('');

  const [hasAllownace, setHasAllowance] = useState<boolean>(false);

  const decimals = useDecimals(addresses.USDT);

  useEffect(() => {
    const getAllowance = async () => {
      const allowance = await publicClient.readContract({
        ...tokenContract(addresses.USDT),
        functionName: 'allowance',
        args: [magicLinkAddress, addresses.TOKEN_MANAGER],
      });

      if (!allowance || allowance === 0n) {
        setHasAllowance(false);
      } else {
        if (Number(inputValue) > Number(formatUnits(allowance, decimals!))) {
          setHasAllowance(false);
        } else {
          setHasAllowance(true);
        }
      }
    };
    getAllowance();
  }, [magicLinkAddress, isTransactionLoading, inputValue, decimals]);

  useEffect(() => {
    if (Number(inputValue) > Number(balance)) {
      setIsMaxValueError(true);
    } else {
      setIsMaxValueError(false);
    }
  }, [inputValue, balance]);

  useEffect(() => {
    const getBalance = async () => {
      const result = await publicClient.readContract({
        ...tokenContract(addresses.USDT),
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
        to: hasAllownace ? addresses.TOKEN_MANAGER : addresses.USDT,
        data: hasAllownace
          ? encodeFunctionData({
              abi: sophieAbi,
              functionName: 'mint',
              args: [magicLinkAddress],
            })
          : encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [
                addresses.TOKEN_MANAGER,
                parseUnits(inputValue, decimals!),
              ],
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

      if (hasAllownace) {
        navigate(routes.MAIN);
      }
    }
  }, [
    decimals,
    hasAllownace,
    inputValue,
    magicLinkAddress,
    navigate,
    walletClient,
  ]);

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
              hasAllownace={hasAllownace}
              isSwapPage
            />
          )
        }
      />
    </>
  );
};

export default SwapPage;
