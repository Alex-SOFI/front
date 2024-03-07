import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { useMagic } from 'hooks';
import { Address, encodeFunctionData, formatUnits, parseUnits } from 'viem';
import { polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import { publicClient, tokenContract } from 'constants/contracts';
import SOFIabi from 'constants/sofiAbi';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';
import { LoadingSpinner } from 'components/basic';

const SellPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const [inputValue, setInputValue] = useState<string>('');

  const [balance, setBalance] = useState<string>('');

  const [isMaxValueError, setIsMaxValueError] = useState<boolean>(false);

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
        ...tokenContract(addresses.SOFI_TOKEN),
        functionName: 'balanceOf',
        args: [magicLinkAddress as Address],
      });
      setBalance(formatUnits(result as bigint, 18));
    };
    getBalance();
  }, [magicLinkAddress]);

  const handleInvestInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setInputValue);
    },
    [],
  );
  const { walletClient } = useMagic(window.location.pathname);

  // TODO: change to mainnet
  const handleSellButtonClick = useCallback(async () => {
    const decimals = await publicClient.readContract({
      ...tokenContract(addresses.SOFI_TOKEN),
      functionName: 'decimals',
    });
    const hash = await walletClient?.sendTransaction({
      account: magicLinkAddress,
      chain: polygonMumbai,
      to: addresses.TOKEN_MANAGER,
      data: encodeFunctionData({
        abi: SOFIabi,
        functionName: 'redeem',
        args: [parseUnits(inputValue, decimals as number)],
      }),
    });
    console.log(hash);
  }, [inputValue, magicLinkAddress, walletClient]);

  const setMaxValue = useCallback(() => {
    setInputValue(balance!);
  }, [balance]);

  return (
    <>
      <Layout
        main={
          !balance ? (
            <LoadingSpinner position='relative' />
          ) : (
            <BuyPageMain
              handleButtonClick={handleSellButtonClick}
              inputValue={inputValue}
              handleInputChange={handleInvestInputChange}
              isSellPage
              balance={Number(balance)}
              setMaxValue={setMaxValue}
              isMaxValueError={isMaxValueError}
            />
          )
        }
      />
    </>
  );
};

export default SellPage;
