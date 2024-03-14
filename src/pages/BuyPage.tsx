import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTransak } from 'hooks';
import { Address } from 'viem';

import { selectWalletInfo } from 'ducks/wallet';

import { handleInputChange } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const BuyPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const [inputValue, setInputValue] = useState<string>('');

  const handleInvestInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event, setInputValue);
    },
    [],
  );

  const { openModal } = useTransak({
    amount: Number(inputValue) || 0,
    address: magicLinkAddress as Address,
    setInputValue,
  });

  return (
    <>
      <Layout
        alwaysShowMarketingClaim
        main={
          <BuyPageMain
            handleButtonClick={openModal}
            inputValue={inputValue}
            handleInputChange={handleInvestInputChange}
            isSellPage={false}
          />
        }
      />
    </>
  );
};

export default BuyPage;
