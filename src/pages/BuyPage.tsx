import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react';

import { noop } from 'tools';

import { BuyPageMain } from 'components/pagesComponents/buyPage';

import { Layout } from 'components';

const BuyPage: FunctionComponent = () => {
  const [investInputValue, setInvestInputValue] = useState<string>('');

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        (!isNaN(Number(event.target.value)) && Number(event.target.value) >= 0)
      ) {
        const float = event.target.value.split('.')?.[1];
        if (
          !float ||
          (float &&
            float?.length <= /* decimals */ 18) /* TODO: get USDC(?) decimals */
        ) {
          setInvestInputValue(event.target.value);
        }
      }
    },
    [],
  );

  // temporary
  const handleBuyButtonClick = useCallback(() => {
    noop();
  }, []);

  return (
    <Layout
      main={
        <BuyPageMain
          handleBuyButtonClick={handleBuyButtonClick}
          investInputValue={investInputValue}
          handleInputChange={handleInputChange}
        />
      }
    />
  );
};

export default BuyPage;
