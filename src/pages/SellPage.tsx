import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { useMagic } from 'hooks';
import { encodeFunctionData, parseUnits } from 'viem';
import { polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import { publicClient, tokenContract } from 'constants/contracts';
import SOFIabi from 'constants/sofiAbi';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const SellPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const [inputValue, setInputValue] = useState<string>('');

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

  return (
    <>
      <Layout
        main={
          <BuyPageMain
            handleButtonClick={handleSellButtonClick}
            inputValue={inputValue}
            handleInputChange={handleInvestInputChange}
            isSellPage
          />
        }
      />
    </>
  );
};

export default SellPage;
