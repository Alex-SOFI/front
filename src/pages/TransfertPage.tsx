import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { useMagic } from 'hooks';
import { isAddress } from 'viem';

import { selectWalletInfo } from 'ducks/wallet';

import { TransfertPageMain } from 'components/pagesComponents/transfertPage';

import { Layout } from 'components';

const TransfertPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [amountInputValue, setAmountInputValue] = useState<string>('');

  const { walletClient } = useMagic(window.location.pathname);

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressInputValue(event.target.value.trim());
    },
    [],
  );

  const handleAmountInputChange = useCallback(
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
          setAmountInputValue(event.target.value.trim());
        }
      }
    },
    [],
  );

  const handleSendButtonClick = useCallback(() => {}, []);

  const invalidAddressError = useMemo(
    () => !!(addressInputValue && !isAddress(addressInputValue)),
    [addressInputValue],
  );

  return (
    <>
      <Layout
        main={
          <TransfertPageMain
            handleSendButtonClick={handleSendButtonClick}
            addressInputValue={addressInputValue}
            handleAddressInputChange={handleAddressInputChange}
            amountInputValue={amountInputValue}
            handleAmountInputChange={handleAmountInputChange}
            invalidAddressError={invalidAddressError}
          />
        }
      />
    </>
  );
};

export default TransfertPage;
