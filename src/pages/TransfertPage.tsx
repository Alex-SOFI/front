import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { SelectChangeEvent } from '@mui/material/Select';
import { useDecimals, useMagic } from 'hooks';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  isAddress,
  parseUnits,
} from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

import addresses from 'constants/addresses';
import { TOKEN_NAMES } from 'constants/textConstants';

import { selectWalletInfo } from 'ducks/wallet';

import { TransfertPageMain } from 'components/pagesComponents/transfertPage';

import { Layout } from 'components';

const TransfertPage: FunctionComponent = () => {
  const { magicLinkAddress } = useSelector(selectWalletInfo);
  const { walletClient } = useMagic(window.location.pathname);

  const [tokenInputValue, setTokenInputValue] = useState<string>(
    TOKEN_NAMES.SOPHIE,
  );
  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [amountInputValue, setAmountInputValue] = useState<string>('');

  const handleTokenInputChange = useCallback((event: SelectChangeEvent) => {
    setTokenInputValue(event.target.value);
  }, []);

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressInputValue(event.target.value.trim());
    },
    [],
  );

  const decimals = useDecimals(
    tokenInputValue === TOKEN_NAMES.SOPHIE
      ? addresses.SOPHIE_TOKEN
      : addresses.USDT,
  );

  const handleAmountInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (
        (event.target.value.length === 1 && event.target.value === '.') ||
        (!isNaN(Number(event.target.value)) && Number(event.target.value) >= 0)
      ) {
        const float = event.target.value.split('.')?.[1];
        if (!float || (float && float?.length <= decimals!)) {
          setAmountInputValue(event.target.value.trim());
        }
      }
    },
    [decimals],
  );

  const handleSendButtonClick = useCallback(async () => {
    const hash = await walletClient?.sendTransaction({
      account: magicLinkAddress,
      chain: import.meta.env.VITE_ENV === 'staging' ? polygonMumbai : polygon,
      to:
        tokenInputValue === TOKEN_NAMES.SOPHIE
          ? addresses.SOPHIE_TOKEN
          : addresses.USDT,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          addressInputValue as Address,
          parseUnits(amountInputValue, decimals!),
        ],
      }),
    });
    if (hash) {
      setTokenInputValue(TOKEN_NAMES.SOPHIE);
      setAddressInputValue('');
      setAmountInputValue('');
    }
  }, [
    addressInputValue,
    amountInputValue,
    decimals,
    magicLinkAddress,
    tokenInputValue,
    walletClient,
  ]);

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
            tokenInputValue={tokenInputValue}
            handleTokenInputChange={handleTokenInputChange}
          />
        }
      />
    </>
  );
};

export default TransfertPage;
